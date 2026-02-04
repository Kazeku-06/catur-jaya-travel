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
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('booking_code')->unique()->nullable();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade')->index();
            $table->enum('catalog_type', ['trip', 'travel'])->index();
            $table->uuid('catalog_id')->index(); // ID Trip atau Travel
            $table->json('booking_data'); // Data booking (nama, hp, tanggal, jumlah orang, catatan)
            $table->decimal('total_price', 15, 2);
            $table->enum('status', ['menunggu_pembayaran', 'menunggu_validasi', 'lunas', 'ditolak', 'expired'])->default('menunggu_pembayaran')->index();
            $table->timestamp('expired_at')->index();
            $table->timestamps();

            // Composite index for efficient catalog lookups
            $table->index(['catalog_type', 'catalog_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
