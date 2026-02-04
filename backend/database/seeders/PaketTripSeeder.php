<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaketTrip;

class PaketTripSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trips = [
            [
                'title' => 'Wisata Bromo Tengger Semeru 3D2N',
                'description' => 'Paket wisata 3 hari 2 malam ke Gunung Bromo dan Tengger Semeru. Termasuk transportasi, penginapan, makan, dan guide profesional. Nikmati sunrise spektakuler di Bromo dan jelajahi keindahan Taman Nasional Bromo Tengger Semeru.',
                'price' => 1500000,
                'duration' => '3 hari 2 malam',
                'location' => 'Bromo, Jawa Timur',
                'quota' => 25,
                'capacity' => 6,
                'image' => null,
                'rundown' => [
                    ['time' => '03.00', 'activity' => 'Sunrise Penanjakan'],
                    ['time' => '07.00', 'activity' => 'Kawah Bromo'],
                    ['time' => '10.00', 'activity' => 'Pasir Berbisik'],
                ],
                'facilities' => ['Jeep 4x4', 'Tiket Masuk', 'Makan 3x', 'Penginapan'],
                'is_active' => true,
            ],
            [
                'title' => 'Paket Wisata Bali 4D3N',
                'description' => 'Jelajahi keindahan Pulau Dewata dengan paket 4 hari 3 malam. Kunjungi Tanah Lot, Uluwatu, Kintamani, dan tempat wisata ikonik lainnya. Termasuk hotel bintang 4, transportasi AC, dan guide berpengalaman.',
                'price' => 2500000,
                'duration' => '4 hari 3 malam',
                'location' => 'Bali',
                'quota' => 30,
                'capacity' => 8,
                'image' => null,
                'rundown' => [
                    ['time' => '09.00', 'activity' => 'Tanah Lot Tour'],
                    ['time' => '13.00', 'activity' => 'Uluwatu Sunset'],
                ],
                'facilities' => ['Hotel *4', 'Private Car', 'Kecak Dance Show'],
                'is_active' => true,
            ],
            [
                'title' => 'Yogyakarta Heritage Tour 2D1N',
                'description' => 'Wisata budaya dan sejarah Yogyakarta. Kunjungi Candi Borobudur, Prambanan, Keraton, Malioboro, dan Taman Sari. Rasakan pengalaman budaya Jawa yang autentik dengan guide lokal berpengalaman.',
                'price' => 850000,
                'duration' => '2 hari 1 malam',
                'location' => 'Yogyakarta',
                'quota' => 20,
                'capacity' => 5,
                'image' => null,
                'rundown' => [
                    ['time' => '08.00', 'activity' => 'Borobudur Temple'],
                    ['time' => '14.00', 'activity' => 'Prambanan Temple'],
                ],
                'facilities' => ['Tiket Heritage', 'Local Guide', 'Makan Malam'],
                'is_active' => true,
            ],
            [
                'title' => 'Lombok Gili Trawangan 3D2N',
                'description' => 'Nikmati keindahan pantai dan bawah laut Lombok dan Gili Trawangan. Paket termasuk snorkeling, island hopping, penginapan tepi pantai, dan transportasi lengkap. Cocok untuk liburan romantis atau keluarga.',
                'price' => 1800000,
                'duration' => '3 hari 2 malam',
                'location' => 'Lombok, NTB',
                'quota' => 15,
                'capacity' => 4,
                'image' => null,
                'rundown' => [
                    ['time' => '10.00', 'activity' => 'Snorkeling 3 Gili'],
                    ['time' => '17.00', 'activity' => 'Sunset at Gili T'],
                ],
                'facilities' => ['Glass Bottom Boat', 'Snorkeling Gear', 'Resort'],
                'is_active' => true,
            ],
            [
                'title' => 'Bandung City Tour 2D1N',
                'description' => 'Jelajahi Paris van Java dengan paket wisata Bandung. Kunjungi factory outlet, Tangkuban Perahu, Kawah Putih, dan kuliner khas Bandung. Termasuk hotel, transportasi, dan makan.',
                'price' => 750000,
                'duration' => '2 hari 1 malam',
                'location' => 'Bandung, Jawa Barat',
                'quota' => 35,
                'capacity' => 7,
                'image' => null,
                'rundown' => [
                    ['time' => '09.00', 'activity' => 'Tangkuban Perahu'],
                    ['time' => '14.00', 'activity' => 'Dago Bakery'],
                ],
                'facilities' => ['Bus Pariwisata', 'Shopping Voucher'],
                'is_active' => true,
            ],
            [
                'title' => 'Raja Ampat Diving 5D4N',
                'description' => 'Eksplorasi surga bawah laut Raja Ampat dengan paket diving 5 hari 4 malam. Termasuk 8 kali diving, penginapan, makan, peralatan diving, dan guide diving bersertifikat. Untuk certified diver.',
                'price' => 4500000,
                'duration' => '5 hari 4 malam',
                'location' => 'Raja Ampat, Papua Barat',
                'quota' => 12,
                'capacity' => 4,
                'image' => null,
                'rundown' => [
                    ['time' => '07.00', 'activity' => 'First Dive at Cape Kri'],
                ],
                'facilities' => ['Full Dive Gear', 'Speedboat', 'Eco Resort'],
                'is_active' => true,
            ],
            [
                'title' => 'Danau Toba Samosir 3D2N',
                'description' => 'Wisata ke danau vulkanik terbesar di dunia. Jelajahi Pulau Samosir, budaya Batak, dan keindahan alam Sumatera Utara. Termasuk penginapan tradisional, transportasi, dan wisata budaya.',
                'price' => 1200000,
                'duration' => '3 hari 2 malam',
                'location' => 'Danau Toba, Sumatera Utara',
                'quota' => 20,
                'capacity' => 6,
                'image' => null,
                'rundown' => [
                    ['time' => '09.00', 'activity' => 'Tomok Village Tour'],
                ],
                'facilities' => ['Kapal Feri', 'Ulos Gift', 'Hotel View Danau'],
                'is_active' => true,
            ],
            [
                'title' => 'Flores Komodo Adventure 4D3N',
                'description' => 'Petualangan ke Taman Nasional Komodo untuk melihat komodo dragon dan keindahan alam Flores. Termasuk boat trip, trekking, snorkeling di Pink Beach, dan penginapan.',
                'price' => 3200000,
                'duration' => '4 hari 3 malam',
                'location' => 'Flores, NTT',
                'quota' => 16,
                'capacity' => 5,
                'image' => null,
                'rundown' => [
                    ['time' => '05.00', 'activity' => 'Padar Island Summit'],
                ],
                'facilities' => ['Live on Board Boat', 'Pink Beach Snorkeling'],
                'is_active' => true,
            ],
            [
                'title' => 'Malang Batu City Tour 2D1N',
                'description' => 'Wisata kota Malang dan Batu yang sejuk. Kunjungi Jatim Park, Museum Angkut, Coban Rondo, dan wisata petik apel. Cocok untuk keluarga dengan anak-anak.',
                'price' => 650000,
                'duration' => '2 hari 1 malam',
                'location' => 'Malang-Batu, Jawa Timur',
                'quota' => 25,
                'capacity' => 8,
                'image' => null,
                'rundown' => [
                    ['time' => '10.00', 'activity' => 'Jatim Park 3'],
                ],
                'facilities' => ['Tiket Jatim Park', 'Petik Apel'],
                'is_active' => true,
            ],
            [
                'title' => 'Belitung Island Hopping 3D2N',
                'description' => 'Jelajahi keindahan Pulau Belitung dengan island hopping ke pulau-pulau kecil. Nikmati pantai berpasir putih, batu granit unik, dan kuliner seafood segar. Termasuk boat, snorkeling, dan penginapan.',
                'price' => 1650000,
                'duration' => '3 hari 2 malam',
                'location' => 'Belitung, Bangka Belitung',
                'quota' => 18,
                'capacity' => 6,
                'image' => null,
                'rundown' => [
                    ['time' => '09.00', 'activity' => 'Lighthouse Island'],
                ],
                'facilities' => ['Mie Belitung Lunch', 'Snorkeling Boat'],
                'is_active' => true,
            ],
        ];

        foreach ($trips as $trip) {
            PaketTrip::create($trip);
        }

        $this->command->info('Paket trips seeded successfully');
    }
}
