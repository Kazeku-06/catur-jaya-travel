try {
    echo "Starting debug...\n";
    $admin = \App\Models\User::where('role', 'admin')->first();
    if (!$admin) {
        echo "No admin found.\n";
    } else {
        echo "Admin found: {$admin->id}\n";
        $count = \App\Models\Notification::where('user_id', $admin->id)->count();
        echo "Notification count: {$count}\n";
    }
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getFile() . ":" . $e->getLine() . "\n";
}
