# Test Admin User Script
# This script checks if admin user exists and has correct role

Write-Host "=== Testing Admin User in Database ===" -ForegroundColor Green

# Test admin user existence and role
Write-Host "`nChecking admin user in database..." -ForegroundColor Cyan

try {
    $result = php -r "
    require 'vendor/autoload.php';
    \$app = require_once 'bootstrap/app.php';
    \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    \$user = App\Models\User::where('email', 'admin@example.com')->first();
    if (\$user) {
        echo json_encode([
            'exists' => true,
            'id' => \$user->id,
            'name' => \$user->name,
            'email' => \$user->email,
            'role' => \$user->role,
            'created_at' => \$user->created_at,
            'updated_at' => \$user->updated_at
        ]);
    } else {
        echo json_encode(['exists' => false]);
    }
    " | ConvertFrom-Json
    
    if ($result.exists) {
        Write-Host "✓ Admin user found" -ForegroundColor Green
        Write-Host "ID: $($result.id)" -ForegroundColor White
        Write-Host "Name: $($result.name)" -ForegroundColor White
        Write-Host "Email: $($result.email)" -ForegroundColor White
        Write-Host "Role: $($result.role)" -ForegroundColor White
        Write-Host "Created: $($result.created_at)" -ForegroundColor White
        
        if ($result.role -eq "admin") {
            Write-Host "✓ User has admin role" -ForegroundColor Green
        } else {
            Write-Host "✗ User does NOT have admin role!" -ForegroundColor Red
            Write-Host "Current role: $($result.role)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Admin user not found!" -ForegroundColor Red
        Write-Host "You may need to run: php artisan db:seed --class=AdminUserSeeder" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ Error checking admin user: $($_.Exception.Message)" -ForegroundColor Red
}

# Check if admin seeder exists
Write-Host "`nChecking admin seeder..." -ForegroundColor Cyan

if (Test-Path "database/seeders/AdminUserSeeder.php") {
    Write-Host "✓ AdminUserSeeder exists" -ForegroundColor Green
} else {
    Write-Host "✗ AdminUserSeeder not found" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
Write-Host "If admin user doesn't exist or doesn't have admin role, that's the issue!" -ForegroundColor Yellow