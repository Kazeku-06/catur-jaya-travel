<?php

namespace Database\Seeders;

use App\Models\PaketTrip;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateTripCapacitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update existing trips to have capacity if they don't have one
        PaketTrip::whereNull('capacity')->orWhere('capacity', 0)->update([
            'capacity' => 6 // Default capacity 6 orang per trip
        ]);
        
        $this->command->info('Updated existing trips with default capacity of 6 people per trip');
    }
}
