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
        'price_per_person',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price_per_person' => 'decimal:2',
        'is_active' => 'boolean',
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

        // Use Laravel's Storage facade to get proper URL
        return \Storage::disk('public')->url($this->image);
    }

    /**
     * Scope for active travels
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relationship with transactions
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'reference_id')
                    ->where('transaction_type', 'travel');
    }
}
