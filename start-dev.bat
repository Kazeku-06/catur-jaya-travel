@echo off
echo ========================================
echo  Catur Jaya Travel - Development Server
echo ========================================

:menu
echo.
echo Pilih opsi:
echo 1. Jalankan Backend dan Frontend
echo 2. Jalankan Backend saja
echo 3. Jalankan Frontend saja
echo 4. Install Dependencies
echo 5. Setup Project
echo 6. Exit
echo.
set /p choice="Masukkan pilihan (1-6): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto install
if "%choice%"=="5" goto setup
if "%choice%"=="6" goto exit
echo Pilihan tidak valid!
goto menu

:dev
echo.
echo Starting Backend and Frontend...
start "Backend Server" cmd /k "cd backend && php artisan serve"
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
goto menu

:backend
echo.
echo Starting Backend Server...
cd backend
php artisan serve
pause
goto menu

:frontend
echo.
echo Starting Frontend Server...
cd frontend
npm run dev
pause
goto menu

:install
echo.
echo Installing Dependencies...
echo Installing Backend dependencies...
cd backend
composer install --ignore-platform-req=ext-iconv --ignore-platform-req=ext-gd
cd ..
echo Installing Frontend dependencies...
cd frontend
npm install
cd ..
echo Dependencies installed successfully!
pause
goto menu

:setup
echo.
echo Setting up project...
cd backend
if not exist .env copy .env.example .env
php artisan key:generate
php artisan migrate
cd ..
echo Setup complete!
pause
goto menu

:exit
echo Goodbye!
exit