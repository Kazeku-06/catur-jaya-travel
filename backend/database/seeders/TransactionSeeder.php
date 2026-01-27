<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\User;
use App\Models\PaketTrip;
use App\Models\Travel;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $trips = PaketTrip::where('is_active', true)->get();
        $travels = Travel::where('is_active', true)->get();

        if ($users->isEmpty() || ($trips->isEmpty() && $travels->isEmpty())) {
            $this->command->warn('No users, trips, or travels found. Please seed users, trips, and travels first.');
            return;
        }

        // Create Trip Transactions
        foreach ($trips->take(5) as $index => $trip) {
            $user = $users->random();
            $participants = rand(1, 4);
            $totalPrice = $trip->price * $participants;
            
            Transaction::create([
                'user_id' => $user->id,
                'transaction_type' => 'trip',
                'reference_id' => $trip->id,
                'total_price' => $totalPrice,
                'payment_status' => $this->getRandomPaymentStatus(),
                'midtrans_order_id' => 'TRIP-' . time() . '-' . strtoupper(substr(md5(rand()), 0, 6)),
                'participants' => $participants,
                'departure_date' => Carbon::now()->addDays(rand(7, 60)),
                'special_requests' => $this->getRandomSpecialRequest(),
                'contact_phone' => '+628' . rand(1000000000, 9999999999),
                'emergency_contact' => 'Emergency Contact - +628' . rand(1000000000, 9999999999),
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }

        // Create Travel Transactions
        foreach ($travels->take(8) as $index => $travel) {
            $user = $users->random();
            $passengers = rand(1, 3);
            $totalPrice = $travel->price_per_person * $passengers;
            
            Transaction::create([
                'user_id' => $user->id,
                'transaction_type' => 'travel',
                'reference_id' => $travel->id,
                'total_price' => $totalPrice,
                'payment_status' => $this->getRandomPaymentStatus(),
                'midtrans_order_id' => 'TRAVEL-' . time() . '-' . strtoupper(substr(md5(rand()), 0, 6)),
                'passengers' => $passengers,
                'departure_date' => Carbon::now()->addDays(rand(1, 30)),
                'pickup_location' => $this->getRandomPickupLocation($travel->origin),
                'destination_address' => $this->getRandomDestinationAddress($travel->destination),
                'contact_phone' => '+628' . rand(1000000000, 9999999999),
                'special_requests' => $this->getRandomTravelRequest(),
                'created_at' => Carbon::now()->subDays(rand(1, 15)),
            ]);
        }

        $this->command->info('Transactions seeded successfully');
    }

    private function getRandomPaymentStatus()
    {
        $statuses = ['pending', 'paid', 'failed', 'expired'];
        $weights = [30, 50, 15, 5]; // 50% paid, 30% pending, 15% failed, 5% expired
        
        $random = rand(1, 100);
        $cumulative = 0;
        
        foreach ($weights as $index => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $statuses[$index];
            }
        }
        
        return 'pending';
    }

    private function getRandomSpecialRequest()
    {
        $requests = [
            'Vegetarian meals please',
            'Need wheelchair accessible accommodation',
            'Celebrating anniversary, please arrange special dinner',
            'Traveling with elderly parents, need ground floor room',
            'Halal food only',
            'No special requests',
            'Need baby crib in the room',
            'Prefer non-smoking room',
            'Need early check-in if possible',
            'Honeymoon package please',
        ];
        
        return $requests[array_rand($requests)];
    }

    private function getRandomTravelRequest()
    {
        $requests = [
            'Need AC during travel',
            'Prefer front seat',
            'Traveling with luggage, need extra space',
            'Pick up from hotel lobby',
            'Need child seat',
            'No special requests',
            'Prefer window seat',
            'Need assistance with luggage',
        ];
        
        return $requests[array_rand($requests)];
    }

    private function getRandomPickupLocation($city)
    {
        $locations = [
            'Jakarta' => ['Soekarno-Hatta Airport', 'Gambir Station', 'Hotel Grand Indonesia', 'Blok M Plaza', 'Kemang Area'],
            'Bandung' => ['Bandung Station', 'Husein Sastranegara Airport', 'Hotel Savoy Homann', 'Dago Area', 'Cihampelas Walk'],
            'Surabaya' => ['Juanda Airport', 'Gubeng Station', 'Hotel Majapahit', 'Tunjungan Plaza', 'Pakuwon Mall'],
            'Yogyakarta' => ['Adisutcipto Airport', 'Tugu Station', 'Malioboro Street', 'Hotel Tentrem', 'Prawirotaman Area'],
            'Denpasar' => ['Ngurah Rai Airport', 'Denpasar Station', 'Sanur Beach', 'Renon Area', 'Teuku Umar Street'],
        ];
        
        $cityLocations = $locations[$city] ?? ['City Center', 'Main Station', 'Airport', 'Hotel Area'];
        return $cityLocations[array_rand($cityLocations)];
    }

    private function getRandomDestinationAddress($city)
    {
        $addresses = [
            'Jakarta' => ['Sudirman Area', 'Menteng District', 'Kemang Village', 'PIK Area', 'Kelapa Gading'],
            'Bandung' => ['Dago Atas', 'Setiabudi Area', 'Cihampelas', 'Pasteur Area', 'Buah Batu'],
            'Surabaya' => ['Gubeng Area', 'Wonokromo', 'Sukolilo', 'Wiyung', 'Rungkut'],
            'Yogyakarta' => ['Sleman Area', 'Bantul', 'Kotagede', 'Condongcatur', 'Depok'],
            'Ubud' => ['Central Ubud', 'Monkey Forest Road', 'Campuhan Ridge', 'Tegallalang', 'Mas Village'],
        ];
        
        $cityAddresses = $addresses[$city] ?? ['City Center', 'Downtown Area', 'Residential Area', 'Business District'];
        return $cityAddresses[array_rand($cityAddresses)];
    }
}