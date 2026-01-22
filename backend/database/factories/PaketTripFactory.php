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
            'id' => $this->faker->uuid(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(500000, 5000000),
            'duration' => $this->faker->randomElement(['1 hari', '2 hari 1 malam', '3 hari 2 malam', '4 hari 3 malam']),
            'location' => $this->faker->city(),
            'quota' => $this->faker->numberBetween(10, 50),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
