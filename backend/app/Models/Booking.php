<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'catalog_type',
        'catalog_id',
        'booking_data',
        'total_price',
        'status',
        'expired_at',
    ];

    protected $casts = [
        'booking_data' => 'array',
        'total_price' => 'decimal:2',
        'expired_at' => 'datetime',
    ];

    // Status constants
    const STATUS_MENUNGGU_PEMBAYARAN = 'menunggu_pembayaran';
    const STATUS_MENUNGGU_VALIDASI = 'menunggu_validasi';
    const STATUS_LUNAS = 'lunas';
    const STATUS_DITOLAK = 'ditolak';
    const STATUS_EXPIRED = 'expired';

    /**
     * Relationship with user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with payment proofs
     */
    public function paymentProofs()
    {
        return $this->hasMany(PaymentProof::class);
    }

    /**
     * Get the latest payment proof
     */
    public function latestPaymentProof()
    {
        return $this->hasOne(PaymentProof::class)->latest('uploaded_at');
    }

    /**
     * Get the catalog item (trip or travel)
     */
    public function catalog()
    {
        if ($this->catalog_type === 'trip') {
            return $this->belongsTo(PaketTrip::class, 'catalog_id');
        } elseif ($this->catalog_type === 'travel') {
            return $this->belongsTo(Travel::class, 'catalog_id');
        }
        return null;
    }

    /**
     * Get catalog item dynamically
     */
    public function getCatalogAttribute()
    {
        if ($this->catalog_type === 'trip') {
            return PaketTrip::find($this->catalog_id);
        } elseif ($this->catalog_type === 'travel') {
            return Travel::find($this->catalog_id);
        }
        return null;
    }

    /**
     * Check if booking is expired
     */
    public function isExpired()
    {
        return $this->expired_at < now();
    }

    /**
     * Mark booking as expired
     */
    public function markAsExpired()
    {
        $this->update(['status' => self::STATUS_EXPIRED]);
    }

    /**
     * Scope for pending payment bookings
     */
    public function scopeMenungguPembayaran($query)
    {
        return $query->where('status', self::STATUS_MENUNGGU_PEMBAYARAN);
    }

    /**
     * Scope for pending validation bookings
     */
    public function scopeMenungguValidasi($query)
    {
        return $query->where('status', self::STATUS_MENUNGGU_VALIDASI);
    }

    /**
     * Scope for paid bookings
     */
    public function scopeLunas($query)
    {
        return $query->where('status', self::STATUS_LUNAS);
    }

    /**
     * Scope for rejected bookings
     */
    public function scopeDitolak($query)
    {
        return $query->where('status', self::STATUS_DITOLAK);
    }

    /**
     * Scope for expired bookings
     */
    public function scopeExpired($query)
    {
        return $query->where('status', self::STATUS_EXPIRED);
    }

    /**
     * Scope for non-expired bookings
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expired_at', '>', now());
    }

    /**
     * Get all available statuses
     */
    public static function getStatuses()
    {
        return [
            self::STATUS_MENUNGGU_PEMBAYARAN,
            self::STATUS_MENUNGGU_VALIDASI,
            self::STATUS_LUNAS,
            self::STATUS_DITOLAK,
            self::STATUS_EXPIRED,
        ];
    }
}