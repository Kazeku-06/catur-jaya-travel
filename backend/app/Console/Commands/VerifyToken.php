<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Str;

class VerifyToken extends Command
{
    protected $signature = 'tokens:verify {token}';
    protected $description = 'Verify a token format and existence';

    public function handle()
    {
        $plainTextToken = $this->argument('token');
        
        $this->info('Verifying token: ' . $plainTextToken);
        
        // Parse token
        if (!Str::contains($plainTextToken, '|')) {
            $this->error('Invalid token format. Expected: ID|TOKEN');
            return;
        }
        
        [$id, $token] = explode('|', $plainTextToken, 2);
        
        $this->info('Token ID: ' . $id);
        $this->info('Token Hash: ' . substr($token, 0, 20) . '...');
        
        // Find token in database
        $accessToken = PersonalAccessToken::find($id);
        
        if (!$accessToken) {
            $this->error('Token not found in database');
            return;
        }
        
        $this->info('Token found in database');
        $this->info('User: ' . $accessToken->tokenable->name . ' (' . $accessToken->tokenable->email . ')');
        $this->info('Role: ' . $accessToken->tokenable->role);
        $this->info('Created: ' . $accessToken->created_at);
        $this->info('Last used: ' . ($accessToken->last_used_at ?? 'Never'));
        
        // Verify hash
        $hashedToken = hash('sha256', $token);
        $storedHash = $accessToken->token;
        
        $this->info('Hash matches: ' . ($hashedToken === $storedHash ? 'YES' : 'NO'));
        
        if ($hashedToken !== $storedHash) {
            $this->error('Token hash does not match stored hash');
            $this->info('Calculated hash: ' . $hashedToken);
            $this->info('Stored hash: ' . $storedHash);
        }
    }
}