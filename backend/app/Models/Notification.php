<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuid;

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    // Notification types constants
    const TYPE_BOOKING_CREATED = 'booking_created';
    const TYPE_PAYMENT_PROOF_UPLOADED = 'payment_proof_uploaded';
    const TYPE_PAYMENT_APPROVED = 'payment_approved';
    const TYPE_PAYMENT_REJECTED = 'payment_rejected';
    const TYPE_BOOKING_EXPIRED = 'booking_expired';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship with user (admin)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope for specific type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for admin notifications
     */
    public function scopeForAdmins($query)
    {
        return $query->whereHas('user', function ($q) {
            $q->where('role', 'admin');
        });
    }

    /**
     * Mark notification as read
     */
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Get available notification types
     */
    public static function getTypes()
    {
        return [
            self::TYPE_BOOKING_CREATED,
            self::TYPE_PAYMENT_PROOF_UPLOADED,
            self::TYPE_PAYMENT_APPROVED,
            self::TYPE_PAYMENT_REJECTED,
            self::TYPE_BOOKING_EXPIRED,
        ];
    }
}