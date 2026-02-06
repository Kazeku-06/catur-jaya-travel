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
        Schema::create('travels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('origin');
            $table->string('destination');
            $table->string('vehicle_type');
            $table->integer('capacity')->default(1)->comment('Kapasitas penumpang');
            $table->decimal('price_per_person', 15, 2)->index();
            $table->string('image')->nullable();
            $table->json('rundown')->nullable();
            $table->json('facilities')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travels');
    }
};
