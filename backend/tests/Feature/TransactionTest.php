<?php

namespace Tests\Feature;

use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    /**
     * Test authenticated user can create trip transaction
     */
    public function test_authenticated_user_can_create_trip_transaction(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/trip/{$trip->id}");

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'transaction_id',
                        'order_id',
                        'total_price',
                        'snap_token',
                        'item' => [
                            'id',
                            'title',
                            'price'
                        ]
                    ]
                ])
                ->assertJson([
                    'message' => 'Transaction created successfully',
                    'data' => [
                        'total_price' => $trip->price,
                        'item' => [
                            'id' => $trip->id,
                            'title' => $trip->title
                        ]
                    ]
                ]);

        // Check database
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'transaction_type' => 'trip',
            'reference_id' => $trip->id,
            'total_price' => $trip->price,
            'payment_status' => 'pending'
        ]);
    }

    /**
     * Test authenticated user can create travel transaction
     */
    public function test_authenticated_user_can_create_travel_transaction(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $travel = Travel::where('is_active', true)->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/travel/{$travel->id}");

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'transaction_id',
                        'order_id',
                        'total_price',
                        'snap_token',
                        'item'
                    ]
                ])
                ->assertJson([
                    'message' => 'Transaction created successfully',
                    'data' => [
                        'total_price' => $travel->price_per_person
                    ]
                ]);

        // Check database
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'transaction_type' => 'travel',
            'reference_id' => $travel->id,
            'total_price' => $travel->price_per_person,
            'payment_status' => 'pending'
        ]);
    }

    /**
     * Test guest cannot create transaction
     */
    public function test_guest_cannot_create_transaction(): void
    {
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->postJson("/api/v1/transactions/trip/{$trip->id}");

        $response->assertStatus(401);
    }

    /**
     * Test user cannot create transaction for inactive trip
     */
    public function test_user_cannot_create_transaction_for_inactive_trip(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;

        $inactiveTrip = PaketTrip::factory()->create([
            'is_active' => false
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/trip/{$inactiveTrip->id}");

        $response->assertStatus(400)
                ->assertJson([
                    'message' => 'Failed to create transaction',
                    'error' => 'Trip not found or inactive'
                ]);
    }

    /**
     * Test user cannot create transaction for non-existent trip
     */
    public function test_user_cannot_create_transaction_for_non_existent_trip(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $fakeId = 'non-existent-uuid';

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/trip/{$fakeId}");

        $response->assertStatus(400)
                ->assertJson([
                    'message' => 'Failed to create transaction',
                    'error' => 'Trip not found or inactive'
                ]);
    }

    /**
     * Test transaction order ID format
     */
    public function test_transaction_order_id_format(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/trip/{$trip->id}");

        $response->assertStatus(201);

        $orderId = $response->json('data.order_id');

        // Check order ID format: TRIP-{timestamp}-{random}
        $this->assertMatchesRegularExpression('/^TRIP-\d+-[A-Z0-9]{6}$/', $orderId);
    }

    /**
     * Test travel transaction order ID format
     */
    public function test_travel_transaction_order_id_format(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $travel = Travel::where('is_active', true)->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/travel/{$travel->id}");

        $response->assertStatus(201);

        $orderId = $response->json('data.order_id');

        // Check order ID format: TRAVEL-{timestamp}-{random}
        $this->assertMatchesRegularExpression('/^TRAVEL-\d+-[A-Z0-9]{6}$/', $orderId);
    }

    /**
     * Test transaction creates with correct price from database
     */
    public function test_transaction_uses_price_from_database(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test-token')->plainTextToken;
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/v1/transactions/trip/{$trip->id}");

        $response->assertStatus(201);

        $totalPrice = $response->json('data.total_price');

        // Price should match exactly with database price
        $this->assertEquals($trip->price, $totalPrice);
    }
}
