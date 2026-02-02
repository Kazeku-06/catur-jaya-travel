<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PaketTrip>
 */
class PaketTripFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(500000, 5000000),
            'duration' => $this->faker->randomElement(['1 hari', '2 hari 1 malam', '3 hari 2 malam', '4 hari 3 malam']),
            'location' => $this->faker->city(),
            'quota' => $this->faker->numberBetween(10, 50),
            'rundown' => [
                ['time' => '08:00', 'activity' => 'Penjemputan'],
                ['time' => '10:00', 'activity' => 'Mulai Wisata'],
                ['time' => '17:00', 'activity' => 'Selesai'],
            ],
            'facilities' => ['Makan 3x', 'Jeep', 'Tiket Masuk'],
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
