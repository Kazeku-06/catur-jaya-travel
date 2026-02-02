<?php

require_once 'vendor/autoload.php';

use App\Models\Booking;
use App\Services\TicketService;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Testing ticket generation...\n";
    
    // Find a LUNAS booking
    $booking = Booking::where('status', 'lunas')->first();
    
    if (!$booking) {
        echo "No LUNAS booking found\n";
        exit(1);
    }
    
    echo "Found booking: " . $booking->id . "\n";
    echo "Booking code: " . $booking->booking_code . "\n";
    echo "Can download: " . ($booking->canDownloadTicket() ? 'yes' : 'no') . "\n";
    
    // Test TicketService
    $ticketService = new TicketService();
    
    echo "Generating PDF...\n";
    $pdf = $ticketService->generateTicketPdf($booking);
    
    echo "PDF generated successfully!\n";
    
    // Save to file for testing
    $filename = 'test-ticket-' . $booking->booking_code . '.pdf';
    file_put_contents($filename, $pdf->output());
    
    echo "PDF saved as: " . $filename . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}