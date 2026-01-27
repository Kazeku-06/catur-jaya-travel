# Monitor Laravel Logs
Write-Host "=== Monitoring Laravel Logs ===" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
Write-Host "Watching: backend/storage/logs/laravel.log" -ForegroundColor Cyan
Write-Host ""

$logFile = "backend/storage/logs/laravel.log"

if (Test-Path $logFile) {
    Get-Content $logFile -Wait -Tail 10 | ForEach-Object {
        if ($_ -match "Sanctum Auth Debug") {
            Write-Host $_ -ForegroundColor Green
        } elseif ($_ -match "ERROR") {
            Write-Host $_ -ForegroundColor Red
        } elseif ($_ -match "INFO") {
            Write-Host $_ -ForegroundColor Cyan
        } else {
            Write-Host $_
        }
    }
} else {
    Write-Host "Log file not found: $logFile" -ForegroundColor Red
    Write-Host "Make sure Laravel server is running and has written to logs" -ForegroundColor Yellow
}