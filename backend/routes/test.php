<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

// Test Google OAuth configuration
Route::get('/test-google-config', function () {
    try {
        $config = config('services.google');
        
        return response()->json([
            'status' => 'success',
            'config' => [
                'client_id' => $config['client_id'] ? 'Set' : 'Not set',
                'client_secret' => $config['client_secret'] ? 'Set' : 'Not set',
                'redirect' => $config['redirect'],
            ],
            'socialite_available' => class_exists('Laravel\Socialite\Facades\Socialite'),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

// Test Google OAuth redirect
Route::get('/test-google-redirect', function () {
    try {
        return Socialite::driver('google')
            ->stateless()
            ->scopes(['email', 'profile'])
            ->redirect();
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});