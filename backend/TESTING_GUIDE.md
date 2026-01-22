# Testing & API Documentation Guide

## 🧪 Testing Setup

### 1. Automated API Documentation dengan Scramble

Scramble telah dikonfigurasi untuk menghasilkan dokumentasi OpenAPI secara otomatis dari kode Laravel Anda.

**Akses Dokumentasi:**
```
http://localhost:8000/docs/api
```

**Fitur Scramble:**
- ✅ Dokumentasi otomatis dari routes dan controllers
- ✅ Interactive API testing dengan "Try It" button
- ✅ Schema validation otomatis
- ✅ Request/Response examples
- ✅ Authentication testing built-in

### 2. Laravel HTTP Tests

#### Menjalankan Tests
```bash
# Jalankan semua tests
php artisan test

# Jalankan test spesifik
php artisan test tests/Feature/ApiValidationTest.php

# Jalankan dengan coverage
php artisan test --coverage

# Jalankan dengan filter
php artisan test --filter=auth
```

#### Test Categories

**✅ API Validation Test (Sudah Berjalan)**
- Route accessibility
- Authentication requirements
- Authorization checks
- Response format validation
- CORS headers
- API versioning

**🔄 Feature Tests (Perlu Database Setup)**
- AuthTest: Registration, login, logout
- PaketTripTest: Public catalog access
- TransactionTest: User transactions
- AdminTest: Admin CRUD operations

### 3. Database Testing Setup

Untuk menjalankan full feature tests, setup database test:

```bash
# Buat database test
mysql -u root -e "CREATE DATABASE backend_test;"

# Atau gunakan SQLite untuk testing (lebih cepat)
# Edit phpunit.xml untuk menggunakan SQLite
```

## 📊 API Monitoring & Security

### 1. Security Validation Checklist

**✅ Authentication & Authorization**
```bash
# Test unauthorized access
curl http://localhost:8000/api/v1/auth/me
# Expected: 401 Unauthorized

# Test admin endpoint without admin role
curl -H "Authorization: Bearer user_token" http://localhost:8000/api/v1/admin/trips
# Expected: 403 Forbidden
```

**✅ Input Validation**
```bash
# Test validation errors
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 422 Validation Error
```

**✅ Rate Limiting (Jika diimplementasi)**
```bash
# Test multiple requests
for i in {1..100}; do curl http://localhost:8000/api/v1/trips; done
```

### 2. Performance Testing

**Load Testing dengan Apache Bench:**
```bash
# Test public endpoints
ab -n 1000 -c 10 http://localhost:8000/api/v1/trips

# Test authenticated endpoints
ab -n 100 -c 5 -H "Authorization: Bearer token" http://localhost:8000/api/v1/auth/me
```

**Memory & Query Monitoring:**
```bash
# Enable query logging
php artisan tinker
>>> DB::enableQueryLog();
>>> // Make API calls
>>> DB::getQueryLog();
```

### 3. API Health Checks

**Basic Health Check:**
```bash
curl -f http://localhost:8000/api/v1/trips || echo "API Down"
```

**Comprehensive Health Check Script:**
```bash
#!/bin/bash
echo "=== API Health Check ==="

# Test public endpoints
echo "Testing public endpoints..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/trips
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/travels
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/carter-mobiles

# Test auth endpoints
echo "Testing auth endpoints..."
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/api/v1/auth/login

echo "Health check complete!"
```

## 🔍 API Testing Tools

### 1. Postman Collection

Buat Postman collection dengan:

**Environment Variables:**
```json
{
  "base_url": "http://localhost:8000/api/v1",
  "admin_token": "{{admin_login_token}}",
  "user_token": "{{user_login_token}}"
}
```

**Test Scripts:**
```javascript
// Auto-save tokens
if (pm.response.json().access_token) {
    pm.environment.set("admin_token", pm.response.json().access_token);
}

// Validate response structure
pm.test("Response has required fields", function () {
    pm.expect(pm.response.json()).to.have.property('message');
    pm.expect(pm.response.json()).to.have.property('data');
});
```

### 2. Insomnia/Thunder Client

Import dari OpenAPI spec yang dihasilkan Scramble:
```
http://localhost:8000/docs/api.json
```

### 3. cURL Test Scripts

**Authentication Flow:**
```bash
#!/bin/bash
# auth_test.sh

echo "=== Testing Authentication Flow ==="

# Register user
echo "1. Register new user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }')

echo $REGISTER_RESPONSE | jq .

# Extract token
USER_TOKEN=$(echo $REGISTER_RESPONSE | jq -r .access_token)

# Test authenticated endpoint
echo "2. Test authenticated endpoint..."
curl -H "Authorization: Bearer $USER_TOKEN" \
  http://localhost:8000/api/v1/auth/me | jq .

# Logout
echo "3. Logout..."
curl -X POST -H "Authorization: Bearer $USER_TOKEN" \
  http://localhost:8000/api/v1/auth/logout | jq .
```

**Transaction Flow:**
```bash
#!/bin/bash
# transaction_test.sh

echo "=== Testing Transaction Flow ==="

# Login admin
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travel.com",
    "password": "password123"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r .access_token)

# Get trips
echo "1. Get available trips..."
TRIPS_RESPONSE=$(curl -s http://localhost:8000/api/v1/trips)
TRIP_ID=$(echo $TRIPS_RESPONSE | jq -r .data[0].id)

# Create transaction
echo "2. Create transaction..."
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8000/api/v1/transactions/trip/$TRIP_ID" | jq .
```

## 📈 Monitoring & Logging

### 1. Laravel Logs
```bash
# Monitor real-time logs
tail -f storage/logs/laravel.log

# Filter error logs
grep "ERROR" storage/logs/laravel.log

# Monitor API requests
grep "api/v1" storage/logs/laravel.log
```

### 2. Performance Monitoring

**Query Performance:**
```php
// Add to AppServiceProvider
DB::listen(function ($query) {
    if ($query->time > 1000) { // Log slow queries
        Log::warning('Slow Query', [
            'sql' => $query->sql,
            'time' => $query->time
        ]);
    }
});
```

**Memory Usage:**
```php
// Add to middleware
Log::info('Memory Usage', [
    'memory' => memory_get_usage(true),
    'peak' => memory_get_peak_usage(true)
]);
```

### 3. Error Tracking

**Custom Error Handler:**
```php
// In Handler.php
public function report(Throwable $exception)
{
    if ($this->shouldReport($exception)) {
        Log::error('API Error', [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
    
    parent::report($exception);
}
```

## 🚀 Production Testing

### 1. Pre-deployment Checklist

```bash
# Run all tests
php artisan test

# Check for security vulnerabilities
composer audit

# Validate environment
php artisan config:cache
php artisan route:cache

# Test database connections
php artisan migrate:status

# Validate API documentation
curl http://localhost:8000/docs/api.json
```

### 2. Smoke Tests for Production

```bash
#!/bin/bash
# production_smoke_test.sh

BASE_URL="https://your-api-domain.com/api/v1"

echo "=== Production Smoke Tests ==="

# Test critical endpoints
endpoints=(
  "trips"
  "travels" 
  "carter-mobiles"
  "payments/midtrans"
)

for endpoint in "${endpoints[@]}"; do
  echo "Testing $endpoint..."
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$endpoint")
  if [ $status -eq 200 ]; then
    echo "✅ $endpoint OK"
  else
    echo "❌ $endpoint FAILED ($status)"
  fi
done
```

## 📋 Testing Best Practices

### 1. Test Organization
- **Unit Tests**: Model logic, services
- **Feature Tests**: HTTP endpoints, integration
- **Browser Tests**: End-to-end user flows

### 2. Test Data Management
- Use factories for consistent test data
- Clean database between tests
- Mock external services (Midtrans)

### 3. Continuous Integration
```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
      - name: Install dependencies
        run: composer install
      - name: Run tests
        run: php artisan test
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Check .env.testing
2. **Memory Limits**: Increase PHP memory_limit
3. **Timeout Issues**: Increase max_execution_time
4. **Permission Errors**: Check storage/ permissions

### Debug Commands
```bash
# Clear all caches
php artisan optimize:clear

# Check routes
php artisan route:list --path=api/v1

# Validate configuration
php artisan config:show database

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

Dengan setup ini, Anda memiliki sistem testing dan monitoring yang komprehensif untuk memastikan API berjalan dengan aman dan optimal!
