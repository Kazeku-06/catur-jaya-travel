<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Booking;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = User::where('role', 'admin')->get();
        $bookings = Booking::all();

        if ($admins->isEmpty()) {
            $this->command->warn('No admin users found. Please seed users first.');
            return;
        }

        // Create notifications for each admin
        foreach ($admins as $admin) {
            // Create booking notifications
            $this->createBookingNotifications($admin);

            // Create payment notifications
            $this->createPaymentNotifications($admin);

            // Create some general notifications from actual bookings
            $this->createGeneralNotifications($admin, $bookings);
        }

        $this->command->info('Notifications seeded successfully');
    }

    private function createBookingNotifications($admin)
    {
        $notifications = [
            [
                'type' => Notification::TYPE_BOOKING_CREATED,
                'title' => 'Booking Baru Masuk',
                'message' => 'Booking baru untuk Wisata Bromo senilai Rp 1.500.000 menunggu validasi.',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(2),
            ],
            [
                'type' => Notification::TYPE_BOOKING_CREATED,
                'title' => 'Booking Baru Masuk',
                'message' => 'Booking baru untuk Travel Jakarta - Bandung senilai Rp 75.000 menunggu validasi.',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(5),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => $notification['type'],
                'title' => $notification['title'],
                'message' => $notification['message'],
                'is_read' => $notification['is_read'],
                'created_at' => $notification['created_at'],
                'updated_at' => $notification['created_at'],
            ]);
        }
    }

    private function createPaymentNotifications($admin)
    {
        $notifications = [
            [
                'type' => Notification::TYPE_PAYMENT_APPROVED,
                'title' => 'Pembayaran Disetujui',
                'message' => 'Pembayaran untuk booking Yogyakarta Heritage telah berhasil divalidasi.',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(1),
            ],
            [
                'type' => Notification::TYPE_PAYMENT_REJECTED,
                'title' => 'Pembayaran Ditolak',
                'message' => 'Bukti pembayaran untuk booking Lombok Gili tidak valid.',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(6),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => $notification['type'],
                'title' => $notification['title'],
                'message' => $notification['message'],
                'is_read' => $notification['is_read'],
                'created_at' => $notification['created_at'],
                'updated_at' => $notification['created_at'],
            ]);
        }
    }

    private function createGeneralNotifications($admin, $bookings)
    {
        // Create some additional notifications from recent bookings
        $recentBookings = $bookings->sortByDesc('created_at')->take(3);

        foreach ($recentBookings as $booking) {
            $itemName = $booking->catalog_type === 'trip' ? 'Trip Package' : 'Travel Service';
            $bookingData = is_string($booking->booking_data) ? json_decode($booking->booking_data, true) : $booking->booking_data;

            Notification::create([
                'user_id' => $admin->id,
                'type' => Notification::TYPE_BOOKING_CREATED,
                'title' => 'Pesanan Baru',
                'message' => "Ada pesanan baru dari " . ($bookingData['nama_pemesan'] ?? 'Pelanggan') . " untuk {$itemName}.",
                'is_read' => rand(0, 1) == 1,
                'created_at' => $booking->created_at->addMinutes(5),
                'updated_at' => $booking->created_at->addMinutes(5),
            ]);

            if ($booking->status === 'lunas') {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => Notification::TYPE_PAYMENT_APPROVED,
                    'title' => 'Pembayaran Terverifikasi',
                    'message' => "Pembayaran untuk pesanan ({$itemName}) telah divalidasi oleh sistem.",
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $booking->created_at->addHours(2),
                    'updated_at' => $booking->created_at->addHours(2),
                ]);
            }
        }
    }
}
