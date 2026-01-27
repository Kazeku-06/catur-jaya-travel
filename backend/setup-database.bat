@echo off
echo ========================================
echo    CATUR JAYA TRAVEL - DATABASE SETUP
echo ========================================
echo.

echo 🔄 Refreshing database...
php artisan migrate:fresh

echo.
echo 🌱 Seeding database with sample data...
php artisan db:seed

echo.
echo ✅ Database setup completed!
echo.
echo 🔑 Admin Login Credentials:
echo Email: admin@caturjaya.com ^| Password: admin123
echo Email: superadmin@caturjaya.com ^| Password: superadmin123
echo.
echo 👤 User Login Credentials:
echo Email: john@example.com ^| Password: password123
echo Email: jane@example.com ^| Password: password123
echo.
pause