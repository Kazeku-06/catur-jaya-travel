<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Travel;

class TravelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $travels = [
            [
                'origin' => 'Jakarta',
                'destination' => 'Bandung',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 75000,
                'image' => null,
                'rundown' => [
                    ['time' => '08.00', 'activity' => 'Keberangkatan Jakarta'],
                    ['time' => '11.00', 'activity' => 'Tiba di Bandung'],
                ],
                'facilities' => ['AC', 'Reclining Seat', 'USB Port'],
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Yogyakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 150000,
                'image' => null,
                'rundown' => [
                    ['time' => '19.00', 'activity' => 'Keberangkatan Jakarta'],
                    ['time' => '05.00', 'activity' => 'Tiba di Yogyakarta'],
                ],
                'facilities' => ['AC', 'Snack', 'Toilet', 'Bantal'],
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Surabaya',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 200000,
                'image' => null,
                'rundown' => [
                    ['time' => '17.00', 'activity' => 'Keberangkatan Jakarta'],
                    ['time' => '06.00', 'activity' => 'Tiba di Surabaya'],
                ],
                'facilities' => ['Full AC', 'Makan 1x', 'Toilet'],
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Semarang',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 125000,
                'image' => null,
                'rundown' => [
                    ['time' => '20.00', 'activity' => 'Keberangkatan Jakarta'],
                ],
                'facilities' => ['AC', 'Water'],
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 75000,
                'image' => null,
                'rundown' => [['time' => '07.00', 'activity' => 'Berangkat Bandung']],
                'facilities' => ['Standard Bus Facilities'],
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Yogyakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 100000,
                'image' => null,
                'rundown' => [['time' => '20.00', 'activity' => 'Berangkat Bandung']],
                'facilities' => ['AC', 'Snack'],
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 200000,
                'image' => null,
                'rundown' => [['time' => '15.00', 'activity' => 'Berangkat Surabaya']],
                'facilities' => ['Makan 1x', 'Toilet'],
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Malang',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 50000,
                'image' => null,
                'rundown' => [['time' => '09.00', 'activity' => 'Berangkat Surabaya']],
                'facilities' => ['Full AC'],
                'is_active' => true,
            ],
            [
                'origin' => 'Yogyakarta',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 150000,
                'image' => null,
                'rundown' => [['time' => '18.00', 'activity' => 'Berangkat Jogja']],
                'facilities' => ['AC', 'Bantal'],
                'is_active' => true,
            ],
            [
                'origin' => 'Yogyakarta',
                'destination' => 'Solo',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 35000,
                'image' => null,
                'rundown' => [['time' => '08.00', 'activity' => 'Berangkat Jogja']],
                'facilities' => ['AC'],
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Bandung',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 60000,
                'image' => null,
                'rundown' => [['time' => '10.00', 'activity' => 'Berangkat Jakarta']],
                'facilities' => ['AC', 'Point to Point'],
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Bogor',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 40000,
                'image' => null,
                'rundown' => [['time' => '07.00', 'activity' => 'Senen - Bogor']],
                'facilities' => ['AC'],
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Garut',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 45000,
                'image' => null,
                'rundown' => [['time' => '13.00', 'activity' => 'Leuwi Panjang - Garut']],
                'facilities' => ['AC'],
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Banyuwangi',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 85000,
                'image' => null,
                'rundown' => [['time' => '21.00', 'activity' => 'Bungurasih - Ketapang']],
                'facilities' => ['AC', 'Makan'],
                'is_active' => true,
            ],
            [
                'origin' => 'Denpasar',
                'destination' => 'Ubud',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 50000,
                'image' => null,
                'rundown' => [['time' => '09.00', 'activity' => 'Airport - Ubud']],
                'facilities' => ['AC', 'WIFI'],
                'is_active' => true,
            ],
        ];

        foreach ($travels as $travel) {
            Travel::create($travel);
        }

        $this->command->info('Travels seeded successfully');
    }
}
