<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'transaction_id',
        'payment_type',
        'transaction_status',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
    ];

    /**
     * Relationship with transaction
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
