<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminTokenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user
        $admin = User::where('email', 'admin@travel.com')->first();
        
        if ($admin) {
            // Delete existing tokens
            $admin->tokens()->delete();
            
            // Create new token
            $token = $admin->createToken('admin-test')->plainTextToken;
            
            $this->command->info('Admin user found: ' . $admin->email);
            $this->command->info('Admin role: ' . $admin->role);
            $this->command->info('Admin token: ' . $token);
            $this->command->info('Use this token to test admin endpoints');
        } else {
            $this->command->error('Admin user not found');
        }
    }
}