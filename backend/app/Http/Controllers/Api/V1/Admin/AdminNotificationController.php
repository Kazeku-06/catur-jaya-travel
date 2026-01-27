<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

/**
 * @tags Admin - Notifications
 */
class AdminNotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications for admin
     *
     * @summary Get admin notifications
     * @description Retrieve all notifications for the authenticated admin user, ordered by newest first
     */
    /**
     * Get all notifications for admin
     *
     * @summary Get admin notifications
     * @description Retrieve all notifications for the authenticated admin user, ordered by newest first
     */
    public function index(Request $request)
    {
        try {
            $adminId = Auth::id();
            $perPage = $request->get('per_page', 5);
            
            // Validate per_page parameter
            if ($perPage > 100) {
                $perPage = 100;
            }
            
            $notifications = $this->notificationService->getNotificationsForAdmin($adminId, $perPage);
            
            return response()->json([
                'message' => 'Notifications retrieved successfully',
                'data' => $notifications->items(),
                'pagination' => [
                    'current_page' => $notifications->currentPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                    'last_page' => $notifications->lastPage(),
                    'from' => $notifications->firstItem(),
                    'to' => $notifications->lastItem(),
                    'has_more_pages' => $notifications->hasMorePages(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve notifications',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // DEBUG
                'file' => $e->getFile(), // DEBUG
                'line' => $e->getLine() // DEBUG
            ], 500);
        }
    }

    /**
     * Get unread notifications count
     *
     * @summary Get unread count
     * @description Get the count of unread notifications for the authenticated admin user
     */
    public function unreadCount()
    {
        try {
            $adminId = Auth::id();
            $count = $this->notificationService->getUnreadCountForAdmin($adminId);
            
            return response()->json([
                'message' => 'Unread count retrieved successfully',
                'data' => [
                    'unread_count' => $count
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve unread count',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // DEBUG
                'file' => $e->getFile(), // DEBUG
                'line' => $e->getLine() // DEBUG
            ], 500);
        }
    }

    /**
     * Mark notification as read
     *
     * @summary Mark notification as read
     * @description Mark a specific notification as read for the authenticated admin user
     */
    public function markAsRead(string $id)
    {
        try {
            $adminId = Auth::id();
            $success = $this->notificationService->markAsRead($id, $adminId);
            
            if (!$success) {
                return response()->json([
                    'message' => 'Notification not found or already read'
                ], 404);
            }
            
            return response()->json([
                'message' => 'Notification marked as read successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     *
     * @summary Mark all notifications as read
     * @description Mark all unread notifications as read for the authenticated admin user
     */
    public function markAllAsRead()
    {
        try {
            $adminId = Auth::id();
            $updatedCount = $this->notificationService->markAllAsReadForAdmin($adminId);
            
            return response()->json([
                'message' => 'All notifications marked as read successfully',
                'data' => [
                    'updated_count' => $updatedCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notification statistics
     *
     * @summary Get notification statistics
     * @description Get notification statistics for the authenticated admin user
     */
    public function statistics()
    {
        try {
            $adminId = Auth::id();
            $stats = $this->notificationService->getNotificationStats($adminId);
            
            return response()->json([
                'message' => 'Notification statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve notification statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}