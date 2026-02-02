<?php

namespace App\Services;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class TicketService
{
    /**
     * Generate and download ticket PDF for a booking
     */
    public function generateTicketPdf(Booking $booking)
    {
        // Validate that booking can download ticket
        if (!$booking->canDownloadTicket()) {
            throw new \Exception('Tiket hanya dapat diunduh untuk booking dengan status LUNAS');
        }

        // Load relationships
        $booking->load(['user', 'latestPaymentProof']);
        $catalog = $booking->catalog;

        // Generate QR code
        $qrCodeData = $this->generateQrCodeData($booking);
        $qrCodeBase64 = base64_encode(QrCode::format('png')->size(150)->generate($qrCodeData));

        // Prepare ticket data
        $ticketData = $this->prepareTicketData($booking, $catalog, $qrCodeBase64);

        // Generate PDF
        $pdf = Pdf::loadView('tickets.official-ticket', $ticketData);
        $pdf->setPaper('A4', 'portrait');

        return $pdf;
    }

    /**
     * Generate QR code data
     */
    private function generateQrCodeData(Booking $booking)
    {
        return json_encode([
            'booking_code' => $booking->booking_code,
            'booking_id' => $booking->id,
            'status' => $booking->status,
            'total_price' => $booking->total_price,
            'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Prepare ticket data for PDF template
     */
    private function prepareTicketData(Booking $booking, $catalog, $qrCodeBase64)
    {
        // Get catalog name based on type
        $catalogName = $booking->catalog_type === 'trip' 
            ? $catalog->title 
            : $catalog->origin . ' - ' . $catalog->destination;

        // Get payment method from payment proof
        $paymentMethod = $booking->latestPaymentProof 
            ? 'Transfer Bank ' . $booking->latestPaymentProof->bank_name
            : 'Manual Transfer';

        // Get validation date (updated_at when status changed to LUNAS)
        $validationDate = $booking->updated_at;

        return [
            'booking' => $booking,
            'catalog' => $catalog,
            'catalog_name' => $catalogName,
            'catalog_type' => $booking->catalog_type === 'trip' ? 'Paket Trip' : 'Travel',
            'user' => $booking->user,
            'booking_data' => $booking->booking_data,
            'payment_method' => $paymentMethod,
            'validation_date' => $validationDate,
            'qr_code_base64' => $qrCodeBase64,
            'company_name' => 'Catur Jaya Travel',
            'company_address' => 'Jl. Raya No. 123, Jakarta',
            'company_phone' => '+62 812-3456-7890',
            'company_email' => 'info@caturjayatravel.com',
        ];
    }
}