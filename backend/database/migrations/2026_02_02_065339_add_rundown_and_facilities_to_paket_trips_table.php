<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('paket_trips', function (Blueprint $table) {
            $table->json('rundown')->nullable()->after('description');
            $table->json('facilities')->nullable()->after('rundown');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paket_trips', function (Blueprint $table) {
            $table->dropColumn(['rundown', 'facilities']);
        });
    }
};