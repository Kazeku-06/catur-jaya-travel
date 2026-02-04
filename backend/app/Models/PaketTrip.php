<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketTrip extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'title',
        'description',
        'rundown',
        'facilities',
        'price',
        'duration',
        'location',
        'quota',
        'capacity',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'rundown' => 'array',
        'facilities' => 'array',
    ];

    protected $appends = ['image_url', 'remaining_quota'];

    /**
     * Get the image URL attribute
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // Use asset helper for public storage URL
        return asset('storage/' . $this->image);
    }

    /**
     * Scope for active trips
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relationship with bookings
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'catalog_id')
                    ->where('catalog_type', 'trip');
    }

    /**
     * Get confirmed bookings (lunas status)
     */
    public function confirmedBookings()
    {
        return $this->bookings()->where('status', Booking::STATUS_LUNAS);
    }

    /**
     * Get remaining quota
     */
    public function getRemainingQuotaAttribute()
    {
        $confirmedBookings = $this->confirmedBookings()->count();
        return max(0, $this->quota - $confirmedBookings);
    }

    /**
     * Check if trip is available for booking
     */
    public function isAvailableForBooking()
    {
        return $this->is_active && $this->remaining_quota > 0;
    }

    /**
     * Check if quota is full
     */
    public function isQuotaFull()
    {
        return $this->remaining_quota <= 0;
    }
}
