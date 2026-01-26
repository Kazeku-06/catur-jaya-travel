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
        Schema::table('transactions', function (Blueprint $table) {
            // Trip booking details
            $table->integer('participants')->nullable(); // For trips
            
            // Travel booking details  
            $table->integer('passengers')->nullable(); // For travels
            
            // Common booking details
            $table->date('departure_date')->nullable();
            $table->text('special_requests')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('emergency_contact')->nullable();
            
            // Travel specific details
            $table->string('pickup_location')->nullable();
            $table->string('destination_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'participants',
                'passengers', 
                'departure_date',
                'special_requests',
                'contact_phone',
                'emergency_contact',
                'pickup_location',
                'destination_address'
            ]);
        });
    }
};