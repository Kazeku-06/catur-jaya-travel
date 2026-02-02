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
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('catalog_type', ['trip', 'travel']);
            $table->uuid('catalog_id'); // ID Trip atau Travel
            $table->json('booking_data'); // Data booking (nama, hp, tanggal, jumlah orang, catatan)
            $table->decimal('total_price', 15, 2);
            $table->enum('status', ['menunggu_pembayaran', 'menunggu_validasi', 'lunas', 'ditolak', 'expired'])->default('menunggu_pembayaran');
            $table->timestamp('expired_at');
            $table->timestamps();
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