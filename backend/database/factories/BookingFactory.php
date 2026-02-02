<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use App\Models\PaketTrip;
use App\Models\Travel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'catalog_type' => 'trip',
            'catalog_id' => function (array $attributes) {
                if ($attributes['catalog_type'] === 'trip') {
                    return PaketTrip::factory()->create()->id;
                }
                return Travel::factory()->create()->id;
            },
            'booking_data' => [
                'nama_pemesan' => $this->faker->name(),
                'nomor_hp' => $this->faker->phoneNumber(),
                'tanggal_keberangkatan' => $this->faker->date(),
                'jumlah_orang' => $this->faker->numberBetween(1, 4),
            ],
            'total_price' => $this->faker->numberBetween(100000, 1000000),
            'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN,
            'expired_at' => now()->addDay(),
        ];
    }
}
