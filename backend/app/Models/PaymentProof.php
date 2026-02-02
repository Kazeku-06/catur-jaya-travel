<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentProof extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'booking_id',
        'bank_name',
        'image_url',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    /**
     * Relationship with booking
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}