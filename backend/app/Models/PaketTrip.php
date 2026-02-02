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
        'image',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'rundown' => 'array',
        'facilities' => 'array',
    ];

    protected $appends = ['image_url'];

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
}
