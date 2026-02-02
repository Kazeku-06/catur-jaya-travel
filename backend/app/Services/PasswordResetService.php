<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetService
{
    /**
     * Token expiry time in minutes
     */
    const TOKEN_EXPIRY_MINUTES = 60;

    /**
     * Send password reset email
     */
    public function sendResetEmail(string $email): bool
    {
        \Log::info('PasswordResetService: sendResetEmail called', ['email' => $email]);
        
        // Always return true to prevent email enumeration
        // But only send email if user exists
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            \Log::info('PasswordResetService: User not found', ['email' => $email]);
            return true; // Don't reveal if email exists
        }

        \Log::info('PasswordResetService: User found, generating token', ['user_id' => $user->id]);

        // Generate secure token
        $token = $this->generateToken();
        
        // Store token in database (hashed)
        $this->storeToken($email, $token);
        
        \Log::info('PasswordResetService: Token stored, sending email');
        
        // Send email
        try {
            $this->sendResetEmailToUser($user, $token);
            \Log::info('PasswordResetService: Email sent successfully');
        } catch (\Exception $e) {
            \Log::error('PasswordResetService: Email sending failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
        
        return true;
    }

    /**
     * Reset password using token
     */
    public function resetPassword(string $email, string $token, string $newPassword): array
    {
        // Find user
        $user = User::where('email', $email)->first();
        if (!$user) {
            throw new \Exception('Token reset password tidak valid atau sudah kadaluarsa.');
        }

        // Verify token
        $resetRecord = $this->getValidToken($email, $token);
        if (!$resetRecord) {
            throw new \Exception('Token reset password tidak valid atau sudah kadaluarsa.');
        }

        // Update password
        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        // Delete reset token
        $this->deleteToken($email);

        // Revoke all user tokens (force re-login)
        $user->tokens()->delete();

        return [
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login ulang.'
        ];
    }

    /**
     * Generate secure random token
     */
    private function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Store token in database (hashed)
     */
    private function storeToken(string $email, string $token): void
    {
        // Delete existing tokens for this email
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();

        // Insert new token
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);
    }

    /**
     * Get valid token record
     */
    private function getValidToken(string $email, string $token): ?object
    {
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$resetRecord) {
            return null;
        }

        // Check if token is expired
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->addMinutes(self::TOKEN_EXPIRY_MINUTES)->isPast()) {
            $this->deleteToken($email);
            return null;
        }

        // Verify token hash
        if (!Hash::check($token, $resetRecord->token)) {
            return null;
        }

        return $resetRecord;
    }

    /**
     * Delete token from database
     */
    private function deleteToken(string $email): void
    {
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
    }

    /**
     * Send reset email to user
     */
    private function sendResetEmailToUser(User $user, string $token): void
    {
        $resetUrl = config('app.frontend_url') . '/reset-password?' . http_build_query([
            'email' => $user->email,
            'token' => $token,
        ]);

        $data = [
            'user' => $user,
            'reset_url' => $resetUrl,
            'expiry_minutes' => self::TOKEN_EXPIRY_MINUTES,
        ];

        Mail::send('emails.password-reset', $data, function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->subject('Reset Password - Catur Jaya Travel');
        });
    }

    /**
     * Clean expired tokens
     */
    public function cleanExpiredTokens(): int
    {
        $expiredTime = Carbon::now()->subMinutes(self::TOKEN_EXPIRY_MINUTES);
        
        return DB::table('password_reset_tokens')
            ->where('created_at', '<', $expiredTime)
            ->delete();
    }
}