<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PaketTripSeeder::class,
            TravelSeeder::class,
            BookingSeeder::class,
            NotificationSeeder::class,
        ]);

        $this->command->info('🎉 Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📋 Seeded data summary:');
        $this->command->info('👥 Users: Admin and regular users created');
        $this->command->info('🏖️  Paket Trips: 10 trip packages created');
        $this->command->info('🚌 Travels: 15 travel routes created');
        $this->command->info('💳 Transactions: Sample transactions created');
        $this->command->info('🔔 Notifications: Admin notifications created');
        $this->command->info('');
        $this->command->info('🔑 Admin Login Credentials:');
        $this->command->info('Email: admin@caturjaya.com | Password: admin123');
        $this->command->info('Email: superadmin@caturjaya.com | Password: superadmin123');
        $this->command->info('');
        $this->command->info('👤 User Login Credentials:');
        $this->command->info('Email: john@example.com | Password: password123');
        $this->command->info('Email: jane@example.com | Password: password123');
    }
}
