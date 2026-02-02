<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Travel extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'travels';

    protected $fillable = [
        'origin',
        'destination',
        'vehicle_type',
        'rundown',
        'facilities',
        'price_per_person',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price_per_person' => 'decimal:2',
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
     * Scope for active travels
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
                    ->where('catalog_type', 'travel');
    }
}
