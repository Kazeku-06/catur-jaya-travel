<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        // Since we are using RefreshDatabase, we need to ensure some data exists for certain tests
        // But many tests will create their own data.
    }

    /**
     * Test authenticated user can create trip booking
     */
    public function test_authenticated_user_can_create_trip_booking(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $trip = PaketTrip::factory()->create(['is_active' => true, 'price' => 1000000]);

        $payload = [
            'nama_pemesan' => 'Test User',
            'nomor_hp' => '08123456789',
            'tanggal_keberangkatan' => now()->addDays(7)->format('Y-m-d'),
            'participants' => 2,
            'catatan_tambahan' => 'Minta yang seru'
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/bookings/trip/{$trip->id}", $payload);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'booking_id',
                        'total_price',
                        'status',
                        'expired_at',
                        'catalog'
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'total_price' => 2000000,
                        'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN
                    ]
                ]);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'catalog_type' => 'trip',
            'catalog_id' => $trip->id,
            'total_price' => 2000000,
            'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN
        ]);
    }

    /**
     * Test authenticated user can create travel booking
     */
    public function test_authenticated_user_can_create_travel_booking(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $travel = Travel::factory()->create(['is_active' => true, 'price_per_person' => 100000]);

        $payload = [
            'nama_pemesan' => 'Test User',
            'nomor_hp' => '08123456789',
            'tanggal_keberangkatan' => now()->addDays(7)->format('Y-m-d'),
            'passengers' => 3,
            'catatan_tambahan' => 'Jemput di rumah'
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/bookings/travel/{$travel->id}", $payload);

        $response->assertStatus(201)
                ->assertJson([
                    'data' => [
                        'total_price' => 300000,
                        'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN
                    ]
                ]);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'catalog_type' => 'travel',
            'catalog_id' => $travel->id,
            'total_price' => 300000
        ]);
    }

    /**
     * Test booking validation
     */
    public function test_booking_validation(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $trip = PaketTrip::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->postJson("/api/v1/bookings/trip/{$trip->id}", []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['nama_pemesan', 'nomor_hp', 'tanggal_keberangkatan', 'participants']);
    }
}
