# Catur Jaya Travel - Development Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Catur Jaya Travel - Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

function Show-Menu {
    Write-Host ""
    Write-Host "Pilih opsi:" -ForegroundColor Yellow
    Write-Host "1. Jalankan Backend dan Frontend" -ForegroundColor White
    Write-Host "2. Jalankan Backend saja" -ForegroundColor White
    Write-Host "3. Jalankan Frontend saja" -ForegroundColor White
    Write-Host "4. Install Dependencies" -ForegroundColor White
    Write-Host "5. Setup Project" -ForegroundColor White
    Write-Host "6. Exit" -ForegroundColor White
    Write-Host ""
}

function Start-Dev {
    Write-Host "Starting Backend and Frontend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; php artisan serve"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
    Write-Host ""
    Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
}

function Start-Backend {
    Write-Host "Starting Backend Server..." -ForegroundColor Green
    Set-Location backend
    php artisan serve
    Set-Location ..
}

function Start-Frontend {
    Write-Host "Starting Frontend Server..." -ForegroundColor Green
    Set-Location frontend
    npm run dev
    Set-Location ..
}

function Install-Dependencies {
    Write-Host "Installing Dependencies..." -ForegroundColor Green
    Write-Host "Installing Backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    composer install --ignore-platform-req=ext-iconv --ignore-platform-req=ext-gd
    Set-Location ..
    Write-Host "Installing Frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
}

function Setup-Project {
    Write-Host "Setting up project..." -ForegroundColor Green
    Set-Location backend
    if (!(Test-Path .env)) {
        Copy-Item .env.example .env
    }
    php artisan key:generate
    php artisan migrate
    Set-Location ..
    Write-Host "Setup complete!" -ForegroundColor Green
}

do {
    Show-Menu
    $choice = Read-Host "Masukkan pilihan (1-6)"
    
    switch ($choice) {
        "1" { Start-Dev }
        "2" { Start-Backend }
        "3" { Start-Frontend }
        "4" { Install-Dependencies }
        "5" { Setup-Project }
        "6" { 
            Write-Host "Goodbye!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "Pilihan tidak valid!" -ForegroundColor Red 
        }
    }
    
    if ($choice -ne "1" -and $choice -ne "6") {
        Write-Host ""
        Read-Host "Press Enter to continue"
    }
} while ($choice -ne "6")