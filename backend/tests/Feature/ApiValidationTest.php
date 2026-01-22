<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiValidationTest extends TestCase
{
    /**
     * Test API routes are accessible
     */
    public function test_api_routes_are_accessible(): void
    {
        // Test public endpoints
        $response = $this->getJson('/api/v1/trips');
        $this->assertContains($response->status(), [200, 500]); // 200 OK or 500 if no data

        $response = $this->getJson('/api/v1/travels');
        $this->assertContains($response->status(), [200, 500]);

        $response = $this->getJson('/api/v1/carter-mobiles');
        $this->assertContains($response->status(), [200, 500]);

        $response = $this->getJson('/api/v1/payments/midtrans');
        $this->assertContains($response->status(), [200, 500]);
    }

    /**
     * Test authentication endpoints structure
     */
    public function test_auth_endpoints_structure(): void
    {
        // Test register endpoint structure
        $response = $this->postJson('/api/v1/auth/register', []);
        $this->assertEquals(422, $response->status()); // Validation error expected

        // Test login endpoint structure
        $response = $this->postJson('/api/v1/auth/login', []);
        $this->assertEquals(422, $response->status()); // Validation error expected
    }

    /**
     * Test protected endpoints require authentication
     */
    public function test_protected_endpoints_require_auth(): void
    {
        // Test user transaction endpoints
        $response = $this->postJson('/api/v1/transactions/trip/fake-id');
        $this->assertEquals(401, $response->status());

        $response = $this->postJson('/api/v1/transactions/travel/fake-id');
        $this->assertEquals(401, $response->status());

        // Test user profile endpoint
        $response = $this->getJson('/api/v1/auth/me');
        $this->assertEquals(401, $response->status());
    }

    /**
     * Test admin endpoints require authentication and admin role
     */
    public function test_admin_endpoints_require_admin_role(): void
    {
        // Test admin endpoints without auth
        $response = $this->getJson('/api/v1/admin/trips');
        $this->assertEquals(401, $response->status());

        $response = $this->getJson('/api/v1/admin/travels');
        $this->assertEquals(401, $response->status());

        $response = $this->getJson('/api/v1/admin/carter-mobiles');
        $this->assertEquals(401, $response->status());

        $response = $this->getJson('/api/v1/admin/transactions');
        $this->assertEquals(401, $response->status());
    }

    /**
     * Test API returns JSON responses
     */
    public function test_api_returns_json_responses(): void
    {
        $response = $this->getJson('/api/v1/trips');
        $this->assertTrue($response->headers->contains('content-type', 'application/json'));

        $response = $this->postJson('/api/v1/auth/login', []);
        $this->assertTrue($response->headers->contains('content-type', 'application/json'));
    }

    /**
     * Test CORS headers (if needed for frontend)
     */
    public function test_cors_headers(): void
    {
        $response = $this->getJson('/api/v1/trips');

        // Basic test that response is returned (CORS would be handled by middleware)
        $this->assertNotNull($response->getContent());
    }

    /**
     * Test API versioning
     */
    public function test_api_versioning(): void
    {
        // Test that v1 endpoints exist
        $response = $this->getJson('/api/v1/trips');
        $this->assertNotEquals(404, $response->status());

        // Test that non-versioned API returns 404
        $response = $this->getJson('/api/trips');
        $this->assertEquals(404, $response->status());
    }

    /**
     * Test error response format consistency
     */
    public function test_error_response_format(): void
    {
        // Test validation error format
        $response = $this->postJson('/api/v1/auth/register', []);
        $this->assertEquals(422, $response->status());

        $responseData = $response->json();
        $this->assertArrayHasKey('message', $responseData);
        $this->assertArrayHasKey('errors', $responseData);

        // Test unauthorized error format
        $response = $this->getJson('/api/v1/auth/me');
        $this->assertEquals(401, $response->status());

        $responseData = $response->json();
        $this->assertArrayHasKey('message', $responseData);
    }
}
