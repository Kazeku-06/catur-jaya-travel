<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Transaction;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = User::where('role', 'admin')->get();
        $transactions = Transaction::all();

        if ($admins->isEmpty()) {
            $this->command->warn('No admin users found. Please seed users first.');
            return;
        }

        // Create notifications for each admin
        foreach ($admins as $admin) {
            // Create order notifications
            $this->createOrderNotifications($admin, $transactions);
            
            // Create payment notifications
            $this->createPaymentNotifications($admin, $transactions);
            
            // Create some general notifications
            $this->createGeneralNotifications($admin);
        }

        $this->command->info('Notifications seeded successfully');
    }

    private function createOrderNotifications($admin, $transactions)
    {
        $orderNotifications = [
            [
                'type' => Notification::TYPE_ORDER_CREATED,
                'title' => 'Order Baru Masuk',
                'message' => 'Order dengan ID TRIP-1642834782-ABC123 (Trip: Wisata Bromo Tengger Semeru) senilai Rp 1.500.000 menunggu pembayaran',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(2),
            ],
            [
                'type' => Notification::TYPE_ORDER_CREATED,
                'title' => 'Order Baru Masuk',
                'message' => 'Order dengan ID TRAVEL-1642834782-XYZ456 (Travel: Jakarta - Bandung) senilai Rp 75.000 menunggu pembayaran',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(5),
            ],
            [
                'type' => Notification::TYPE_ORDER_CREATED,
                'title' => 'Order Baru Masuk',
                'message' => 'Order dengan ID TRIP-1642834782-DEF789 (Trip: Paket Wisata Bali 4D3N) senilai Rp 5.000.000 menunggu pembayaran',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(8),
            ],
        ];

        foreach ($orderNotifications as $notification) {
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

    private function createPaymentNotifications($admin, $transactions)
    {
        $paymentNotifications = [
            [
                'type' => Notification::TYPE_PAYMENT_PAID,
                'title' => 'Pembayaran Berhasil',
                'message' => 'Pembayaran untuk order TRIP-1642834782-GHI012 (Trip: Yogyakarta Heritage Tour) senilai Rp 1.700.000 telah berhasil',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(1),
            ],
            [
                'type' => Notification::TYPE_PAYMENT_PAID,
                'title' => 'Pembayaran Berhasil',
                'message' => 'Pembayaran untuk order TRAVEL-1642834782-JKL345 (Travel: Surabaya - Jakarta) senilai Rp 200.000 telah berhasil',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(3),
            ],
            [
                'type' => Notification::TYPE_PAYMENT_FAILED,
                'title' => 'Pembayaran Gagal',
                'message' => 'Pembayaran untuk order TRIP-1642834782-MNO678 (Trip: Lombok Gili Trawangan) senilai Rp 3.600.000 gagal (expired)',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(6),
            ],
            [
                'type' => Notification::TYPE_PAYMENT_FAILED,
                'title' => 'Pembayaran Gagal',
                'message' => 'Pembayaran untuk order TRAVEL-1642834782-PQR901 (Travel: Jakarta - Yogyakarta) senilai Rp 300.000 gagal (cancelled)',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(12),
            ],
        ];

        foreach ($paymentNotifications as $notification) {
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

    private function createGeneralNotifications($admin)
    {
        // Create some additional notifications from recent transactions
        $recentTransactions = Transaction::orderBy('created_at', 'desc')->take(3)->get();
        
        foreach ($recentTransactions as $transaction) {
            $itemName = $transaction->transaction_type === 'trip' ? 'Trip Package' : 'Travel Service';
            
            Notification::create([
                'user_id' => $admin->id,
                'type' => Notification::TYPE_ORDER_CREATED,
                'title' => 'Order Baru Masuk',
                'message' => "Order dengan ID {$transaction->midtrans_order_id} ({$itemName}) senilai Rp " . number_format($transaction->total_price, 0, ',', '.') . " menunggu pembayaran",
                'is_read' => rand(0, 1) == 1,
                'created_at' => $transaction->created_at->addMinutes(5),
                'updated_at' => $transaction->created_at->addMinutes(5),
            ]);

            // Create payment notification if transaction is paid
            if ($transaction->payment_status === 'paid') {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => Notification::TYPE_PAYMENT_PAID,
                    'title' => 'Pembayaran Berhasil',
                    'message' => "Pembayaran untuk order {$transaction->midtrans_order_id} ({$itemName}) senilai Rp " . number_format($transaction->total_price, 0, ',', '.') . " telah berhasil",
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $transaction->created_at->addHours(2),
                    'updated_at' => $transaction->created_at->addHours(2),
                ]);
            } elseif (in_array($transaction->payment_status, ['failed', 'expired'])) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => Notification::TYPE_PAYMENT_FAILED,
                    'title' => 'Pembayaran Gagal',
                    'message' => "Pembayaran untuk order {$transaction->midtrans_order_id} ({$itemName}) senilai Rp " . number_format($transaction->total_price, 0, ',', '.') . " gagal ({$transaction->payment_status})",
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $transaction->created_at->addHours(1),
                    'updated_at' => $transaction->created_at->addHours(1),
                ]);
            }
        }
    }
}