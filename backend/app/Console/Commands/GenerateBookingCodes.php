<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;

class GenerateBookingCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:generate-codes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate booking codes for existing bookings that don\'t have one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating booking codes for existing bookings...');

        $bookingsWithoutCode = Booking::whereNull('booking_code')->get();

        if ($bookingsWithoutCode->isEmpty()) {
            $this->info('All bookings already have booking codes.');
            return;
        }

        $count = 0;
        foreach ($bookingsWithoutCode as $booking) {
            $booking->booking_code = Booking::generateBookingCode();
            $booking->save();
            $count++;
        }

        $this->info("Generated booking codes for {$count} bookings.");
    }
}