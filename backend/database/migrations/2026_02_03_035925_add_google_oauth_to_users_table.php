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
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->after('email');
            $table->enum('auth_provider', ['local', 'google'])->default('local')->after('google_id');
            
            // Add index for google_id for better performance
            $table->index('google_id');
            $table->index('auth_provider');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['google_id']);
            $table->dropIndex(['auth_provider']);
            $table->dropColumn(['google_id', 'auth_provider']);
        });
    }
};