<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes one by one to avoid failure if one already exists
        $this->addIndexSafe('bookings', ['status']);
        $this->addIndexSafe('bookings', ['catalog_type', 'catalog_id']);
        $this->addIndexSafe('bookings', ['user_id']);
        $this->addIndexSafe('bookings', ['created_at']);

        $this->addIndexSafe('paket_trips', ['is_active']);
        $this->addIndexSafe('travels', ['is_active']);
    }

    /**
     * Safe index addition helper
     */
    private function addIndexSafe(string $table, array $columns)
    {
        try {
            Schema::table($table, function (Blueprint $tableObj) use ($columns) {
                $tableObj->index($columns);
            });
        } catch (\Exception $e) {
            // Index might already exist, skip it
            Log::info("Index on {$table} for columns " . implode(',', $columns) . " already exists or failed to create.");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            try { $table->dropIndex(['status']); } catch (\Exception $e) {}
            try { $table->dropIndex(['catalog_type', 'catalog_id']); } catch (\Exception $e) {}
            try { $table->dropIndex(['user_id']); } catch (\Exception $e) {}
            try { $table->dropIndex(['created_at']); } catch (\Exception $e) {}
        });
    }
};
