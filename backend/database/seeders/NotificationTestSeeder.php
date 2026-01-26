<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\Notification;

class NotificationTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@travel.com'],
            [
                'name' => 'Admin Travel',
                'password' => bcrypt('password123'),
                'role' => 'admin'
            ]
        );
        $this->command->info('Admin user created/found: ' . $admin->email);

        // Create regular user if not exists
        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password123'),
                'role' => 'user'
            ]
        );
        $this->command->info('Test user created/found: ' . $user->email);

        // Create sample trip if not exists
        $trip = PaketTrip::firstOrCreate(
            ['title' => 'Test Trip Bromo'],
            [
                'description' => 'Test trip to Bromo for notification testing',
                'price' => 1500000,
                'duration' => '3 hari 2 malam',
                'location' => 'Bromo, Jawa Timur',
                'quota' => 20,
                'is_active' => true
            ]
        );
        $this->command->info('Test trip created/found: ' . $trip->title);

        // Create sample travel if not exists
        $travel = Travel::firstOrCreate(
            ['origin' => 'Jakarta', 'destination' => 'Bandung'],
            [
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 75000,
                'is_active' => true
            ]
        );
        $this->command->info('Test travel created/found: ' . $travel->origin . ' - ' . $travel->destination);

        // Create sample notifications for testing
        $notifications = [
            [
                'type' => Notification::TYPE_ORDER_CREATED,
                'title' => 'Order Baru Masuk',
                'message' => 'Order dengan ID TRIP-1642834782-ABC123 (Trip: Test Trip Bromo) senilai Rp 1.500.000 menunggu pembayaran',
            ],
            [
                'type' => Notification::TYPE_PAYMENT_PAID,
                'title' => 'Pembayaran Berhasil',
                'message' => 'Pembayaran untuk order TRIP-1642834782-ABC123 (Trip: Test Trip Bromo) senilai Rp 1.500.000 telah berhasil',
            ],
            [
                'type' => Notification::TYPE_PAYMENT_FAILED,
                'title' => 'Pembayaran Gagal',
                'message' => 'Pembayaran untuk order TRAVEL-1642834782-XYZ456 (Travel: Jakarta - Bandung) senilai Rp 75.000 gagal (expired)',
            ],
        ];

        foreach ($notifications as $notificationData) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => $notificationData['type'],
                'title' => $notificationData['title'],
                'message' => $notificationData['message'],
                'is_read' => false,
            ]);
        }

        $this->command->info('Sample notifications created for admin');
        $this->command->info('Test data setup complete!');
    }
}