<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarterMobile extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'vehicle_name',
        'description',
        'whatsapp_number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope for active carter mobiles
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
