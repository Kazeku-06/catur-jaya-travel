<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class CheckTokens extends Command
{
    protected $signature = 'tokens:check';
    protected $description = 'Check all personal access tokens';

    public function handle()
    {
        $this->info('Checking personal access tokens...');
        
        $tokens = PersonalAccessToken::with('tokenable')->get();
        
        if ($tokens->isEmpty()) {
            $this->warn('No tokens found');
            return;
        }
        
        foreach ($tokens as $token) {
            $this->info('Token ID: ' . $token->id);
            $this->info('Name: ' . $token->name);
            $this->info('User: ' . $token->tokenable->name . ' (' . $token->tokenable->email . ')');
            $this->info('Role: ' . $token->tokenable->role);
            $this->info('Created: ' . $token->created_at);
            $this->info('Last used: ' . ($token->last_used_at ?? 'Never'));
            $this->info('---');
        }
    }
}