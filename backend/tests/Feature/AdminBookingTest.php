<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminBookingTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /**
     * Test admin can view all bookings
     */
    public function test_admin_can_view_all_bookings(): void
    {
        Booking::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/bookings');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data',
                    'pagination'
                ]);
    }

    /**
     * Test admin can approve booking
     */
    public function test_admin_can_approve_booking(): void
    {
        $booking = Booking::factory()->create([
            'status' => Booking::STATUS_MENUNGGU_VALIDASI
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/v1/admin/bookings/{$booking->id}/approve");

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Pembayaran berhasil disetujui'
                ]);

        $this->assertEquals(Booking::STATUS_LUNAS, $booking->fresh()->status);
    }

    /**
     * Test admin can reject booking
     */
    public function test_admin_can_reject_booking(): void
    {
        $booking = Booking::factory()->create([
            'status' => Booking::STATUS_MENUNGGU_VALIDASI
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/v1/admin/bookings/{$booking->id}/reject", [
            'reason' => 'Bukti transfer palsu'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Pembayaran berhasil ditolak'
                ]);

        $this->assertEquals(Booking::STATUS_DITOLAK, $booking->fresh()->status);
    }

    /**
     * Test admin can see statistics
     */
    public function test_admin_can_see_statistics(): void
    {
        Booking::factory()->create(['status' => Booking::STATUS_LUNAS, 'total_price' => 500000]);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/bookings/statistics');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'total_bookings',
                        'total_revenue'
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'total_revenue' => 500000
                    ]
                ]);
    }
}
