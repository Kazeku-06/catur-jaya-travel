<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\User;
use App\Models\PaketTrip;
use App\Models\Travel;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get sample users, trips, and travels
        $users = User::where('role', 'user')->take(3)->get();
        $trips = PaketTrip::take(2)->get();
        $travels = Travel::take(2)->get();

        if ($users->isEmpty() || ($trips->isEmpty() && $travels->isEmpty())) {
            $this->command->info('Please run UserSeeder, PaketTripSeeder, and TravelSeeder first');
            return;
        }

        $bookings = [];

        // Create sample bookings for trips
        foreach ($trips as $trip) {
            foreach ($users as $user) {
                $bookings[] = [
                    'id' => \Str::uuid(),
                    'user_id' => $user->id,
                    'catalog_type' => 'trip',
                    'catalog_id' => $trip->id,
                    'booking_data' => json_encode([
                        'nama_pemesan' => $user->name,
                        'nomor_hp' => '081234567890',
                        'tanggal_keberangkatan' => Carbon::now()->addDays(rand(7, 30))->format('Y-m-d'),
                        'jumlah_orang' => rand(1, 4),
                        'catatan_tambahan' => 'Tidak ada catatan khusus',
                    ]),
                    'total_price' => $trip->price * rand(1, 4),
                    'status' => collect(['menunggu_pembayaran', 'menunggu_validasi', 'lunas'])->random(),
                    'expired_at' => Carbon::now()->addHours(24),
                    'created_at' => Carbon::now()->subDays(rand(0, 7)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 7)),
                ];
            }
        }

        // Create sample bookings for travels
        foreach ($travels as $travel) {
            foreach ($users->take(2) as $user) {
                $bookings[] = [
                    'id' => \Str::uuid(),
                    'user_id' => $user->id,
                    'catalog_type' => 'travel',
                    'catalog_id' => $travel->id,
                    'booking_data' => json_encode([
                        'nama_pemesan' => $user->name,
                        'nomor_hp' => '081234567890',
                        'tanggal_keberangkatan' => Carbon::now()->addDays(rand(7, 30))->format('Y-m-d'),
                        'jumlah_orang' => rand(1, 3),
                        'catatan_tambahan' => 'Mohon dijemput tepat waktu',
                    ]),
                    'total_price' => $travel->price_per_person * rand(1, 3),
                    'status' => collect(['menunggu_pembayaran', 'menunggu_validasi', 'lunas', 'ditolak'])->random(),
                    'expired_at' => Carbon::now()->addHours(24),
                    'created_at' => Carbon::now()->subDays(rand(0, 7)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 7)),
                ];
            }
        }

        Booking::insert($bookings);

        $this->command->info('Sample bookings created successfully!');
    }
}