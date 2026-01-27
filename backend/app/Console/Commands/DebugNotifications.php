<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Schema;

class DebugNotifications extends Command
{
    protected $signature = 'debug:notifications';
    protected $description = 'Debug notifications table and data';

    public function handle()
    {
        $this->info('=== Debugging Notifications ===');
        
        // Check if notifications table exists
        if (Schema::hasTable('notifications')) {
            $this->info('✓ Notifications table exists');
            
            // Check table structure
            $columns = Schema::getColumnListing('notifications');
            $this->info('Table columns: ' . implode(', ', $columns));
            
            // Check notifications count
            try {
                $count = Notification::count();
                $this->info("Total notifications: {$count}");
                
                // Check admin users
                $admins = User::where('role', 'admin')->get();
                $this->info("Admin users found: {$admins->count()}");
                
                foreach ($admins as $admin) {
                    $adminNotifications = Notification::where('user_id', $admin->id)->count();
                    $unreadCount = Notification::where('user_id', $admin->id)->where('is_read', false)->count();
                    $this->info("Admin {$admin->email}: {$adminNotifications} total, {$unreadCount} unread");
                }
                
            } catch (\Exception $e) {
                $this->error('Error querying notifications: ' . $e->getMessage());
            }
            
        } else {
            $this->error('✗ Notifications table does not exist');
            $this->info('Running migration...');
            
            try {
                $this->call('migrate');
                $this->info('Migration completed');
            } catch (\Exception $e) {
                $this->error('Migration failed: ' . $e->getMessage());
            }
        }
        
        return 0;
    }
}