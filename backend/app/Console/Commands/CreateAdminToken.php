<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CreateAdminToken extends Command
{
    protected $signature = 'tokens:create-admin {email}';
    protected $description = 'Create a new token for admin user';

    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error('User not found');
            return;
        }
        
        if ($user->role !== 'admin') {
            $this->error('User is not an admin');
            return;
        }
        
        // Delete existing tokens
        $user->tokens()->delete();
        
        // Create new token
        $token = $user->createToken('auth_token');
        
        $this->info('New token created for: ' . $user->name . ' (' . $user->email . ')');
        $this->info('Token: ' . $token->plainTextToken);
        $this->info('Use this token in your frontend');
    }
}