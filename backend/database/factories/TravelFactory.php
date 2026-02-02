<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Travel>
 */
class TravelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'origin' => $this->faker->city(),
            'destination' => $this->faker->city(),
            'vehicle_type' => $this->faker->randomElement(['Bus Executive', 'Bus Super Executive', 'Hiace', 'Elf']),
            'price_per_person' => $this->faker->numberBetween(50000, 500000),
            'is_active' => $this->faker->boolean(80),
        ];
    }
}
