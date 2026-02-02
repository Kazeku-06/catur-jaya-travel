<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create notification for all admin users
     */
    public function createForAllAdmins(string $type, string $title, string $message): void
    {
        try {
            // Get all admin users
            $admins = User::where('role', 'admin')->get();
            
            foreach ($admins as $admin) {
                $this->createNotification($admin->id, $type, $title, $message);
            }
            
            Log::info('Notifications created for all admins', [
                'type' => $type,
                'title' => $title,
                'admin_count' => $admins->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create notifications for admins', [
                'type' => $type,
                'title' => $title,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create notification for specific admin
     */
    public function createForAdmin(string $adminId, string $type, string $title, string $message): ?Notification
    {
        try {
            return $this->createNotification($adminId, $type, $title, $message);
        } catch (\Exception $e) {
            Log::error('Failed to create notification for admin', [
                'admin_id' => $adminId,
                'type' => $type,
                'title' => $title,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Create booking notification when new booking is created
     */
    public function createBookingNotification(string $bookingId, string $catalogName, float $totalPrice): void
    {
        $title = "Booking Baru Masuk";
        $message = "Booking baru untuk {$catalogName} senilai Rp " . number_format($totalPrice, 0, ',', '.') . " menunggu pembayaran";
        
        $this->createForAllAdmins(Notification::TYPE_BOOKING_CREATED, $title, $message);
    }

    /**
     * Create payment proof uploaded notification
     */
    public function createPaymentProofNotification(string $bookingId, string $catalogName, float $totalPrice): void
    {
        $title = "Bukti Pembayaran Diterima";
        $message = "Bukti pembayaran untuk booking {$catalogName} senilai Rp " . number_format($totalPrice, 0, ',', '.') . " telah diupload dan menunggu validasi";
        
        $this->createForAllAdmins(Notification::TYPE_PAYMENT_PROOF_UPLOADED, $title, $message);
    }

    /**
     * Create payment approved notification (for user)
     */
    public function createPaymentApprovedNotification(string $userId, string $catalogName, float $totalPrice): void
    {
        $title = "Pembayaran Disetujui";
        $message = "Pembayaran Anda untuk {$catalogName} senilai Rp " . number_format($totalPrice, 0, ',', '.') . " telah disetujui. Booking Anda sudah lunas.";
        
        $this->createNotification($userId, Notification::TYPE_PAYMENT_APPROVED, $title, $message);
    }

    /**
     * Create payment rejected notification (for user)
     */
    public function createPaymentRejectedNotification(string $userId, string $catalogName, float $totalPrice, string $reason = ''): void
    {
        $title = "Pembayaran Ditolak";
        $reasonText = $reason ? " Alasan: {$reason}" : '';
        $message = "Pembayaran Anda untuk {$catalogName} senilai Rp " . number_format($totalPrice, 0, ',', '.') . " ditolak.{$reasonText} Silakan booking ulang.";
        
        $this->createNotification($userId, Notification::TYPE_PAYMENT_REJECTED, $title, $message);
    }

    /**
     * Create booking expired notification (for user)
     */
    public function createBookingExpiredNotification(string $userId, string $catalogName): void
    {
        $title = "Booking Expired";
        $message = "Booking Anda untuk {$catalogName} telah expired karena belum ada pembayaran dalam 24 jam. Silakan booking ulang.";
        
        $this->createNotification($userId, Notification::TYPE_BOOKING_EXPIRED, $title, $message);
    }

    /**
     * Get unread notifications count for admin
     */
    public function getUnreadCountForAdmin(string $adminId): int
    {
        try {
            return Notification::where('user_id', $adminId)
                ->unread()
                ->count();
        } catch (\Exception $e) {
            Log::error('Failed to get unread count for admin', [
                'admin_id' => $adminId,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Get notifications for admin with pagination
     */
    public function getNotificationsForAdmin(string $adminId, int $perPage = 20)
    {
        try {
            return Notification::where('user_id', $adminId)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
        } catch (\Exception $e) {
            Log::error('Failed to get notifications for admin', [
                'admin_id' => $adminId,
                'per_page' => $perPage,
                'error' => $e->getMessage()
            ]);
            // Return empty paginator
            return new \Illuminate\Pagination\LengthAwarePaginator(
                [],
                0,
                $perPage,
                1,
                ['path' => request()->url()]
            );
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(string $notificationId, string $adminId): bool
    {
        try {
            $notification = Notification::where('id', $notificationId)
                ->where('user_id', $adminId)
                ->first();

            if (!$notification) {
                return false;
            }

            $notification->markAsRead();
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to mark notification as read', [
                'notification_id' => $notificationId,
                'admin_id' => $adminId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Mark all notifications as read for admin
     */
    public function markAllAsReadForAdmin(string $adminId): int
    {
        try {
            return Notification::where('user_id', $adminId)
                ->unread()
                ->update(['is_read' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to mark all notifications as read', [
                'admin_id' => $adminId,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Private method to create notification
     */
    private function createNotification(string $userId, string $type, string $title, string $message): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);
    }

    /**
     * Get notification statistics for admin dashboard
     */
    public function getNotificationStats(string $adminId): array
    {
        $total = Notification::where('user_id', $adminId)->count();
        $unread = Notification::where('user_id', $adminId)->unread()->count();
        $read = $total - $unread;

        $byType = Notification::where('user_id', $adminId)
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'total' => $total,
            'unread' => $unread,
            'read' => $read,
            'by_type' => $byType
        ];
    }
}