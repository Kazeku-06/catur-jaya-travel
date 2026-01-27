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
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Yogyakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 150000,
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Surabaya',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 200000,
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Semarang',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 125000,
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 75000,
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Yogyakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 100000,
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 200000,
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Malang',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 50000,
                'is_active' => true,
            ],
            [
                'origin' => 'Yogyakarta',
                'destination' => 'Jakarta',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 150000,
                'is_active' => true,
            ],
            [
                'origin' => 'Yogyakarta',
                'destination' => 'Solo',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 35000,
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Bandung',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 60000,
                'is_active' => true,
            ],
            [
                'origin' => 'Jakarta',
                'destination' => 'Bogor',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 40000,
                'is_active' => true,
            ],
            [
                'origin' => 'Bandung',
                'destination' => 'Garut',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 45000,
                'is_active' => true,
            ],
            [
                'origin' => 'Surabaya',
                'destination' => 'Banyuwangi',
                'vehicle_type' => 'Bus Executive',
                'price_per_person' => 85000,
                'is_active' => true,
            ],
            [
                'origin' => 'Denpasar',
                'destination' => 'Ubud',
                'vehicle_type' => 'Minibus',
                'price_per_person' => 50000,
                'is_active' => true,
            ],
        ];

        foreach ($travels as $travel) {
            Travel::create($travel);
        }

        $this->command->info('Travels seeded successfully');
    }
}