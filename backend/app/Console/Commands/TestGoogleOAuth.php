<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Socialite\Facades\Socialite;

class TestGoogleOAuth extends Command
{
    protected $signature = 'test:google-oauth';
    protected $description = 'Test Google OAuth configuration';

    public function handle()
    {
        $this->info('Testing Google OAuth Configuration...');
        $this->newLine();

        // Test environment variables
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        $this->info('Environment Variables:');
        $this->line('Client ID: ' . ($clientId ? 'Set (' . substr($clientId, 0, 20) . '...)' : 'Not Set'));
        $this->line('Client Secret: ' . ($clientSecret ? 'Set' : 'Not Set'));
        $this->line('Redirect URI: ' . ($redirectUri ?: 'Not Set'));
        $this->newLine();

        // Test Socialite
        try {
            $driver = Socialite::driver('google');
            $this->info('✅ Socialite Google driver loaded successfully');
        } catch (\Exception $e) {
            $this->error('❌ Socialite Google driver failed: ' . $e->getMessage());
            return 1;
        }

        // Test configuration
        if (!$clientId || !$clientSecret