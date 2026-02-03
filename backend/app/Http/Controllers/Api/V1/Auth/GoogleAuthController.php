<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect user to Google OAuth
     * 
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect()
    {
        try {
            Log::info('Google OAuth redirect initiated');
            
            return Socialite::driver('google')
                ->stateless()
                ->scopes(['email', 'profile'])
                ->redirect();
                
        } catch (\Exception $e) {
            Log::error('Google OAuth redirect error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengarahkan ke Google OAuth',
                'error' => 'OAUTH_REDIRECT_ERROR'
            ], 500);
        }
    }

    /**
     * Handle Google OAuth callback
     * 
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback()
    {
        try {
            Log::info('Google OAuth callback received');
            
            // Get user data from Google
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            Log::info('Google user data received', [
                'google_id' => $googleUser->getId(),
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName()
            ]);

            // Validate required data
            if (!$googleUser->getEmail() || !$googleUser->getId()) {
                Log::error('Google OAuth: Missing required user data');
                return $this->redirectWithError('DATA_INCOMPLETE', 'Data pengguna Google tidak lengkap');
            }

            // Check if user exists by email
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // User exists - update Google data if needed
                Log::info('Existing user found', ['user_id' => $user->id]);
                
                $updateData = [];
                
                // Update google_id if not set
                if (!$user->google_id) {
                    $updateData['google_id'] = $googleUser->getId();
                }
                
                // Update auth_provider if still local
                if ($user->auth_provider === 'local') {
                    $updateData['auth_provider'] = 'google';
                }
                
                if (!empty($updateData)) {
                    $user->update($updateData);
                    Log::info('User updated with Google data', $updateData);
                }
                
            } else {
                // Create new user
                Log::info('Creating new Google user');
                
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'auth_provider' => 'google',
                    'role' => 'user',
                    'password' => null, // No password for Google users
                ]);
                
                Log::info('New Google user created', ['user_id' => $user->id]);
            }

            // Prevent admin login via Google
            if ($user->isAdmin()) {
                Log::warning('Admin attempted Google login', ['user_id' => $user->id]);
                return $this->redirectWithError('ADMIN_NOT_ALLOWED', 'Admin tidak dapat login menggunakan Google');
            }

            // Create Sanctum token
            $token = $user->createToken('google-auth')->plainTextToken;
            
            Log::info('Sanctum token created for Google user', ['user_id' => $user->id]);

            // Prepare user data for frontend
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'auth_provider' => $user->auth_provider,
            ];

            // Redirect to frontend with token and user data
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $redirectUrl = $frontendUrl . '/oauth/callback?token=' . urlencode($token) . '&user=' . urlencode(base64_encode(json_encode($userData)));
            
            Log::info('Redirecting to frontend', ['url' => $frontendUrl . '/oauth/callback']);
            
            return redirect($redirectUrl);

        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('Google OAuth invalid state: ' . $e->getMessage());
            return $this->redirectWithError('INVALID_STATE', 'Sesi OAuth tidak valid');
            
        } catch (\Exception $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->redirectWithError('OAUTH_ERROR', 'Terjadi kesalahan saat login dengan Google');
        }
    }

    /**
     * Redirect to frontend with error
     * 
     * @param string $errorCode
     * @param string $message
     * @return \Illuminate\Http\RedirectResponse
     */
    private function redirectWithError($errorCode, $message)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $redirectUrl = $frontendUrl . '/oauth/callback?error=' . urlencode($errorCode) . '&message=' . urlencode($message);
        
        return redirect($redirectUrl);
    }
}