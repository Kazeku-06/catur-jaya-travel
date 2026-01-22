<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'transaction_type',
        'reference_id',
        'total_price',
        'payment_status',
        'midtrans_order_id',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    /**
     * Relationship with user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with payments
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the referenced item (trip or travel)
     */
    public function referencedItem()
    {
        if ($this->transaction_type === 'trip') {
            return $this->belongsTo(PaketTrip::class, 'reference_id');
        } elseif ($this->transaction_type === 'travel') {
            return $this->belongsTo(Travel::class, 'reference_id');
        }

        return null;
    }

    /**
     * Scope for pending transactions
     */
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    /**
     * Scope for paid transactions
     */
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
}
