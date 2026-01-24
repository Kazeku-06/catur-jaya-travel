<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PaketTrip;
use App\Models\Travel;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Paket Trips
        PaketTrip::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'title' => 'Wisata Bromo Tengger Semeru',
            'description' => 'Paket wisata 3 hari 2 malam ke Bromo Tengger Semeru dengan pemandangan sunrise yang menakjubkan',
            'price' => 1500000,
            'duration' => '3 hari 2 malam',
            'location' => 'Bromo, Jawa Timur',
            'quota' => 20,
            'image' => 'trips/bromo.jpg',
            'is_active' => true,
        ]);

        PaketTrip::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'title' => 'Wisata Pantai Malang Selatan',
            'description' => 'Paket wisata 2 hari 1 malam mengunjungi pantai-pantai eksotis di Malang Selatan',
            'price' => 800000,
            'duration' => '2 hari 1 malam',
            'location' => 'Malang Selatan, Jawa Timur',
            'quota' => 15,
            'image' => 'trips/malang-selatan.jpg',
            'is_active' => true,
        ]);

        PaketTrip::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'title' => 'Wisata Kawah Ijen',
            'description' => 'Paket wisata 2 hari 1 malam ke Kawah Ijen dengan blue fire yang memukau',
            'price' => 1200000,
            'duration' => '2 hari 1 malam',
            'location' => 'Banyuwangi, Jawa Timur',
            'quota' => 12,
            'image' => 'trips/kawah-ijen.jpg',
            'is_active' => true,
        ]);

        // Sample Travels
        Travel::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'origin' => 'Surabaya',
            'destination' => 'Malang',
            'vehicle_type' => 'Bus AC',
            'price_per_person' => 50000,
            'image' => 'travels/surabaya-malang.jpg',
            'is_active' => true,
        ]);

        Travel::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'origin' => 'Malang',
            'destination' => 'Batu',
            'vehicle_type' => 'Minibus',
            'price_per_person' => 25000,
            'image' => 'travels/malang-batu.jpg',
            'is_active' => true,
        ]);

        Travel::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'origin' => 'Surabaya',
            'destination' => 'Banyuwangi',
            'vehicle_type' => 'Bus Executive',
            'price_per_person' => 120000,
            'image' => 'travels/surabaya-banyuwangi.jpg',
            'is_active' => true,
        ]);
    }
}
