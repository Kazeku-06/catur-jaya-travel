<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use App\Services\PasswordResetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * @tags Authentication
 */
class AuthController extends Controller
{
    protected $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {
        $this->passwordResetService = $passwordResetService;
    }
    /**
     * Register a new user
     *
     * @summary Register new user account
     * @description Create a new user account with email and password. Returns user data and access token.
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // Default role is user
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     *
     * @summary User login
     * @description Authenticate user with email and password. Returns user data and access token.
     */
    public function login(LoginRequest $request)
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     *
     * @summary Get current user profile
     * @description Get the profile information of the currently authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ]
        ]);
    }

    /**
     * Logout user
     *
     * @summary User logout
     * @description Logout the current user by revoking the access token.
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send password reset email
     *
     * @summary Request password reset
     * @description Send password reset email to user. Always returns success to prevent email enumeration.
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            \Log::info('Forgot password request received', ['email' => $request->email]);
            
            // Check if user exists and uses Google auth
            $user = User::where('email', $request->email)->first();
            if ($user && $user->isGoogleUser()) {
                \Log::info('Google user attempted password reset', ['email' => $request->email]);
                
                return response()->json([
                    'message' => 'Akun ini menggunakan login Google. Silakan login menggunakan Google.',
                    'error' => 'GOOGLE_USER_RESET_NOT_ALLOWED'
                ], 400);
            }
            
            $result = $this->passwordResetService->sendResetEmail($request->email);
            
            \Log::info('Forgot password service result', ['result' => $result]);

            return response()->json([
                'message' => 'Jika email terdaftar, link reset password telah dikirim.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Forgot password error', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Jika email terdaftar, link reset password telah dikirim.'
            ]);
        }
    }

    /**
     * Reset password using token
     *
     * @summary Reset password
     * @description Reset user password using email and token from reset email.
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            // Check if user exists and uses Google auth
            $user = User::where('email', $request->email)->first();
            if ($user && $user->isGoogleUser()) {
                \Log::warning('Google user attempted password reset', ['email' => $request->email]);
                
                return response()->json([
                    'message' => 'Akun ini menggunakan login Google. Reset password tidak tersedia.',
                    'error' => 'GOOGLE_USER_RESET_NOT_ALLOWED'
                ], 400);
            }
            
            $result = $this->passwordResetService->resetPassword(
                $request->email,
                $request->token,
                $request->password
            );

            return response()->json([
                'message' => $result['message']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
