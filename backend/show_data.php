<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== DATABASE SEEDED DATA SUMMARY ===\n\n";

// Users
echo "USERS:\n";
$users = App\Models\User::all();
foreach ($users as $user) {
    echo "- {$user->name} ({$user->email}) - Role: {$user->role}\n";
}

// Trips
echo "\nTRIPS (Paket Wisata):\n";
$trips = App\Models\PaketTrip::all();
foreach ($trips as $trip) {
    $price = number_format($trip->price);
    echo "- {$trip->title} - {$trip->location} - Rp {$price}\n";
}

// Travels
echo "\nTRAVELS (Transportasi):\n";
$travels = App\Models\Travel::all();
foreach ($travels as $travel) {
    $price = number_format($travel->price_per_person);
    echo "- {$travel->origin} → {$travel->destination} ({$travel->vehicle_type}) - Rp {$price}\n";
}

// Notifications
echo "\nNOTIFICATIONS:\n";
$notifications = App\Models\Notification::all();
foreach ($notifications as $notif) {
    echo "- {$notif->title} ({$notif->type})\n";
}

echo "\n=== SEEDING COMPLETE ===\n";
echo "You can now:\n";
echo "1. Login as admin: admin@travel.com / password123\n";
echo "2. Login as user: user@test.com / password\n";
echo "3. Browse trips and travels on the website\n";
echo "4. Test booking functionality\n";
echo "5. Check admin dashboard and notifications\n";