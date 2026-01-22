<?php

namespace Tests\Feature;

use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\CarterMobile;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $adminToken;
    protected $userToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');

        // Create admin token
        $admin = User::where('role', 'admin')->first();
        $this->adminToken = $admin->createToken('admin-test-token')->plainTextToken;

        // Create user token
        $user = User::factory()->create(['role' => 'user']);
        $this->userToken = $user->createToken('user-test-token')->plainTextToken;
    }

    /**
     * Test admin can access admin endpoints
     */
    public function test_admin_can_access_admin_endpoints(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/v1/admin/trips');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data'
                ]);
    }

    /**
     * Test user cannot access admin endpoints
     */
    public function test_user_cannot_access_admin_endpoints(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->userToken,
        ])->getJson('/api/v1/admin/trips');

        $response->assertStatus(403)
                ->assertJson([
                    'message' => 'Forbidden'
                ]);
    }

    /**
     * Test guest cannot access admin endpoints
     */
    public function test_guest_cannot_access_admin_endpoints(): void
    {
        $response = $this->getJson('/api/v1/admin/trips');

        $response->assertStatus(401);
    }

    /**
     * Test admin can create trip
     */
    public function test_admin_can_create_trip(): void
    {
        $tripData = [
            'title' => 'Test Trip',
            'description' => 'Test trip description',
            'price' => 1000000,
            'duration' => '2 hari 1 malam',
            'location' => 'Test Location',
            'quota' => 20,
            'is_active' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/v1/admin/trips', $tripData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'price',
                        'duration',
                        'location',
                        'quota',
                        'is_active'
                    ]
                ])
                ->assertJson([
                    'message' => 'Trip created successfully',
                    'data' => $tripData
                ]);

        $this->assertDatabaseHas('paket_trips', $tripData);
    }

    /**
     * Test admin can update trip
     */
    public function test_admin_can_update_trip(): void
    {
        $trip = PaketTrip::first();
        $updateData = [
            'title' => 'Updated Trip Title',
            'description' => 'Updated description',
            'price' => 2000000,
            'duration' => '3 hari 2 malam',
            'location' => 'Updated Location',
            'quota' => 25,
            'is_active' => false
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->putJson("/api/v1/admin/trips/{$trip->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Trip updated successfully',
                    'data' => $updateData
                ]);

        $this->assertDatabaseHas('paket_trips', array_merge(['id' => $trip->id], $updateData));
    }

    /**
     * Test admin can delete trip
     */
    public function test_admin_can_delete_trip(): void
    {
        $trip = PaketTrip::first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->deleteJson("/api/v1/admin/trips/{$trip->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Trip deleted successfully'
                ]);

        $this->assertDatabaseMissing('paket_trips', ['id' => $trip->id]);
    }

    /**
     * Test admin can create travel
     */
    public function test_admin_can_create_travel(): void
    {
        $travelData = [
            'origin' => 'Jakarta',
            'destination' => 'Bandung',
            'vehicle_type' => 'Bus Executive',
            'price_per_person' => 75000,
            'is_active' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/v1/admin/travels', $travelData);

        $response->assertStatus(201)
                ->assertJson([
                    'message' => 'Travel created successfully',
                    'data' => $travelData
                ]);

        $this->assertDatabaseHas('travels', $travelData);
    }

    /**
     * Test admin can create carter mobile
     */
    public function test_admin_can_create_carter_mobile(): void
    {
        $carterData = [
            'vehicle_name' => 'Toyota Innova',
            'description' => 'Mobil keluarga premium',
            'whatsapp_number' => '6281234567890',
            'is_active' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/v1/admin/carter-mobiles', $carterData);

        $response->assertStatus(201)
                ->assertJson([
                    'message' => 'Carter mobile created successfully',
                    'data' => $carterData
                ]);

        $this->assertDatabaseHas('carter_mobiles', $carterData);
    }

    /**
     * Test admin can view all transactions
     */
    public function test_admin_can_view_all_transactions(): void
    {
        // Create some test transactions
        $user = User::factory()->create(['role' => 'user']);
        $trip = PaketTrip::first();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'transaction_type' => 'trip',
            'reference_id' => $trip->id,
            'payment_status' => 'paid'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/v1/admin/transactions');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'current_page',
                        'data' => [
                            '*' => [
                                'id',
                                'user_id',
                                'transaction_type',
                                'reference_id',
                                'total_price',
                                'payment_status',
                                'user',
                                'payments'
                            ]
                        ]
                    ]
                ]);
    }

    /**
     * Test admin can get transaction statistics
     */
    public function test_admin_can_get_transaction_statistics(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/v1/admin/transactions/statistics');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'total_transactions',
                        'pending_transactions',
                        'paid_transactions',
                        'failed_transactions',
                        'expired_transactions',
                        'total_revenue',
                        'trip_transactions',
                        'travel_transactions'
                    ]
                ])
                ->assertJson([
                    'message' => 'Statistics retrieved successfully'
                ]);
    }

    /**
     * Test admin trip validation
     */
    public function test_admin_trip_validation(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/v1/admin/trips', [
            'title' => '',
            'price' => -1000,
            'quota' => 0
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'description', 'price', 'duration', 'location', 'quota']);
    }

    /**
     * Test admin can filter transactions
     */
    public function test_admin_can_filter_transactions(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/v1/admin/transactions?payment_status=paid&transaction_type=trip');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data'
                ]);
    }
}
