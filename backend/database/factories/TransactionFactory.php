<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $transactionType = $this->faker->randomElement(['trip', 'travel']);

        return [
            'id' => $this->faker->uuid(),
            'user_id' => \App\Models\User::factory(),
            'transaction_type' => $transactionType,
            'reference_id' => $this->faker->uuid(),
            'total_price' => $this->faker->numberBetween(50000, 2000000),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed', 'expired']),
            'midtrans_order_id' => strtoupper($transactionType) . '-' . time() . '-' . $this->faker->randomLetter() . $this->faker->randomLetter() . $this->faker->randomLetter() . $this->faker->randomNumber(3),
        ];
    }
}
