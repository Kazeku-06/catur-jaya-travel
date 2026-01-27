# Show Seeded Data Summary
Write-Host "=== Database Seeded Data Summary ===" -ForegroundColor Green

Write-Host "`nUsers:" -ForegroundColor Cyan
php artisan tinker --execute="
App\Models\User::all()->each(function(\$user) {
    echo '- ' . \$user->name . ' (' . \$user->email . ') - Role: ' . \$user->role . PHP_EOL;
});
"

Write-Host "`nTrips (Paket Wisata):" -ForegroundColor Cyan
php artisan tinker --execute="
App\Models\PaketTrip::all()->each(function(\$trip) {
    echo '- ' . \$trip->title . ' - ' . \$trip->location . ' - Rp ' . number_format(\$trip->price) . PHP_EOL;
});
"

Write-Host "`nTravels (Transportasi):" -ForegroundColor Cyan
php artisan tinker --execute="
App\Models\Travel::all()->each(function(\$travel) {
    echo '- ' . \$travel->origin . ' → ' . \$travel->destination . ' (' . \$travel->vehicle_type . ') - Rp ' . number_format(\$travel->price_per_person) . PHP_EOL;
});
"

Write-Host "`nNotifications:" -ForegroundColor Cyan
php artisan tinker --execute="
App\Models\Notification::all()->each(function(\$notif) {
    echo '- ' . \$notif->title . ' (' . \$notif->type . ')' . PHP_EOL;
});
"

Write-Host "`n=== Seeding Complete ===" -ForegroundColor Green
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. Login as admin: admin@travel.com / password123" -ForegroundColor White
Write-Host "2. Login as user: user@test.com / password" -ForegroundColor White
Write-Host "3. Browse trips and travels on the website" -ForegroundColor White
Write-Host "4. Test booking functionality" -ForegroundColor White
Write-Host "5. Check admin dashboard and notifications" -ForegroundColor White