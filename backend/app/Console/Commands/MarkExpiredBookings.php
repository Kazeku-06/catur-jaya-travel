<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BookingService;

class MarkExpiredBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:mark-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark expired bookings as expired status';

    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        parent::__construct();
        $this->bookingService = $bookingService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired bookings...');
        
        $expiredCount = $this->bookingService->markExpiredBookings();
        
        if ($expiredCount > 0) {
            $this->info("Marked {$expiredCount} bookings as expired.");
        } else {
            $this->info('No expired bookings found.');
        }

        return 0;
    }
}