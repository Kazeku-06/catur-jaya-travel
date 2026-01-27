<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class FixNotificationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Checking notifications table...');
        
        // Check if notifications table exists
        if (!Schema::hasTable('notifications')) {
            $this->command->error('Notifications table does not exist!');
            $this->command->info('Creating notifications table...');
            
            Schema::create('notifications', function ($table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->string('type');
                $table->string('title');
                $table->text('message');
                $table->boolean('is_read')->default(false);
                $table->timestamps();
                
                $table->index(['user_id', 'is_read']);
                $table->index(['type', 'created_at']);
                $table->index('created_at');
            });
            
            $this->command->info('Notifications table created successfully!');
        } else {
            $this->command->info('Notifications table already exists.');
        }
        
        // Get admin user
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->error('No admin user found!');
            return;
        }
        
        $this->command->info("Found admin user: {$admin->email}");
        
        // Create sample notifications using raw SQL to avoid model issues
        $notifications = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'user_id' => $admin->id,
                'type' => 'order_created',
                'title' => 'Order Baru Masuk',
                'message' => 'Order dengan ID TRIP-123 menunggu pembayaran',
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'user_id' => $admin->id,
                'type' => 'payment_paid',
                'title' => 'Pembayaran Berhasil',
                'message' => 'Pembayaran untuk order TRIP-123 telah berhasil',
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        
        foreach ($notifications as $notification) {
            // Check if notification already exists
            $exists = DB::table('notifications')
                ->where('user_id', $notification['user_id'])
                ->where('title', $notification['title'])
                ->exists();
                
            if (!$exists) {
                DB::table('notifications')->insert($notification);
                $this->command->info("Created notification: {$notification['title']}");
            }
        }
        
        $count = DB::table('notifications')->where('user_id', $admin->id)->count();
        $this->command->info("Total notifications for admin: {$count}");
    }
}