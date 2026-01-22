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
        'price',
        'duration',
        'location',
        'quota',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Scope for active trips
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
                    ->where('transaction_type', 'trip');
    }
}
