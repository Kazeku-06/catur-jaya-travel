<?php

namespace Tests\Feature;

use App\Models\PaketTrip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PaketTripTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    /**
     * Test guest can view all active trips
     */
    public function test_guest_can_view_all_active_trips(): void
    {
        $response = $this->getJson('/api/v1/trips');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'price',
                            'duration',
                            'location',
                            'quota',
                            'is_active',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ])
                ->assertJson([
                    'message' => 'Trips retrieved successfully'
                ]);

        // Ensure only active trips are returned
        $trips = $response->json('data');
        foreach ($trips as $trip) {
            $this->assertTrue($trip['is_active']);
        }
    }

    /**
     * Test guest can view specific trip detail
     */
    public function test_guest_can_view_trip_detail(): void
    {
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->getJson("/api/v1/trips/{$trip->id}");

        $response->assertStatus(200)
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
                    'message' => 'Trip retrieved successfully',
                    'data' => [
                        'id' => $trip->id,
                        'title' => $trip->title,
                        'is_active' => true
                    ]
                ]);
    }

    /**
     * Test guest cannot view inactive trip
     */
    public function test_guest_cannot_view_inactive_trip(): void
    {
        $trip = PaketTrip::factory()->create([
            'is_active' => false
        ]);

        $response = $this->getJson("/api/v1/trips/{$trip->id}");

        $response->assertStatus(404)
                ->assertJson([
                    'message' => 'Trip not found'
                ]);
    }

    /**
     * Test guest cannot view non-existent trip
     */
    public function test_guest_cannot_view_non_existent_trip(): void
    {
        $fakeId = 'non-existent-uuid';

        $response = $this->getJson("/api/v1/trips/{$fakeId}");

        $response->assertStatus(404)
                ->assertJson([
                    'message' => 'Trip not found'
                ]);
    }

    /**
     * Test only active trips are shown in listing
     */
    public function test_only_active_trips_shown_in_listing(): void
    {
        // Create inactive trip
        PaketTrip::factory()->create([
            'is_active' => false,
            'title' => 'Inactive Trip'
        ]);

        $response = $this->getJson('/api/v1/trips');

        $response->assertStatus(200);

        $trips = $response->json('data');
        $inactiveTrip = collect($trips)->firstWhere('title', 'Inactive Trip');

        $this->assertNull($inactiveTrip, 'Inactive trip should not be shown in listing');
    }

    /**
     * Test trip data structure
     */
    public function test_trip_data_structure(): void
    {
        $trip = PaketTrip::where('is_active', true)->first();

        $response = $this->getJson("/api/v1/trips/{$trip->id}");

        $response->assertStatus(200);

        $tripData = $response->json('data');

        // Validate data types
        $this->assertIsString($tripData['id']);
        $this->assertIsString($tripData['title']);
        $this->assertIsString($tripData['description']);
        $this->assertIsString($tripData['price']);
        $this->assertIsString($tripData['duration']);
        $this->assertIsString($tripData['location']);
        $this->assertIsInt($tripData['quota']);
        $this->assertIsBool($tripData['is_active']);

        // Validate price format (decimal)
        $this->assertMatchesRegularExpression('/^\d+\.\d{2}$/', $tripData['price']);
    }
}
