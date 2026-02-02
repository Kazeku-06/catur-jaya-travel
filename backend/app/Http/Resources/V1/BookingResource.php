<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'status' => $this->status,
            'total_price' => (float) $this->total_price,
            'total_price_formatted' => 'Rp ' . number_format($this->total_price, 0, ',', '.'),
            'catalog_type' => $this->catalog_type,

            // Booking data
            'booking_data' => $this->booking_data,

            // Catalog data
            'catalog' => $this->catalog,

            // Relationships
            'user' => $this->whenLoaded('user'),
            'payment_proof' => $this->whenLoaded('latestPaymentProof'),

            // Helper flags
            'is_expired' => $this->isExpired(),
            'can_download_ticket' => $this->canDownloadTicket(),

            // Timestamps
            'expired_at' => $this->expired_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
