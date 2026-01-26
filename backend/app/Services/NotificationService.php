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
     * Create order notification when new order is created
     */
    public function createOrderNotification(string $orderId, string $transactionType, float $totalPrice): void
    {
        $title = "Order Baru Masuk";
        $message = "Order dengan ID {$orderId} ({$transactionType}) senilai Rp " . number_format($totalPrice, 0, ',', '.') . " menunggu pembayaran";
        
        $this->createForAllAdmins(Notification::TYPE_ORDER_CREATED, $title, $message);
    }

    /**
     * Create payment success notification
     */
    public function createPaymentSuccessNotification(string $orderId, string $transactionType, float $totalPrice): void
    {
        $title = "Pembayaran Berhasil";
        $message = "Pembayaran untuk order {$orderId} ({$transactionType}) senilai Rp " . number_format($totalPrice, 0, ',', '.') . " telah berhasil";
        
        $this->createForAllAdmins(Notification::TYPE_PAYMENT_PAID, $title, $message);
    }

    /**
     * Create payment failed notification
     */
    public function createPaymentFailedNotification(string $orderId, string $transactionType, float $totalPrice, string $reason = ''): void
    {
        $title = "Pembayaran Gagal";
        $reasonText = $reason ? " ({$reason})" : '';
        $message = "Pembayaran untuk order {$orderId} ({$transactionType}) senilai Rp " . number_format($totalPrice, 0, ',', '.') . " gagal{$reasonText}";
        
        $this->createForAllAdmins(Notification::TYPE_PAYMENT_FAILED, $title, $message);
    }

    /**
     * Get unread notifications count for admin
     */
    public function getUnreadCountForAdmin(string $adminId): int
    {
        return Notification::where('user_id', $adminId)
            ->unread()
            ->count();
    }

    /**
     * Get notifications for admin with pagination
     */
    public function getNotificationsForAdmin(string $adminId, int $perPage = 20)
    {
        return Notification::where('user_id', $adminId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
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