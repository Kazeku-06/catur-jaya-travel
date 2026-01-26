<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class TestToken extends Command
{
    protected $signature = 'tokens:test {id}';
    protected $description = 'Test a specific token';

    public function handle()
    {
        $tokenId = $this->argument('id');
        
        $token = PersonalAccessToken::with('tokenable')->find($tokenId);
        
        if (!$token) {
            $this->error('Token not found');
            return;
        }
        
        $this->info('Token Details:');
        $this->info('ID: ' . $token->id);
        $this->info('Name: ' . $token->name);
        $this->info('User: ' . $token->tokenable->name . ' (' . $token->tokenable->email . ')');
        $this->info('Role: ' . $token->tokenable->role);
        $this->info('Token: ' . $token->id . '|' . $token->token);
        $this->info('Created: ' . $token->created_at);
        $this->info('Last used: ' . ($token->last_used_at ?? 'Never'));
        
        // Test the token
        $fullToken = $token->id . '|' . $token->token;
        $this->info('Full token for testing: ' . $fullToken);
    }
}