# ===================================
# Environment Security Checker
# ===================================
# Script untuk memastikan file .env tidak ter-commit ke Git

Write-Host "🔒 Checking Environment Security..." -ForegroundColor Yellow
Write-Host ""

# Check if .env files are tracked in Git
Write-Host "📋 Checking tracked .env files in Git:" -ForegroundColor Cyan
$trackedEnvFiles = git ls-files | Select-String "\.env$|\.env\."
if ($trackedEnvFiles) {
    Write-Host "❌ WARNING: Found tracked .env files:" -ForegroundColor Red
    $trackedEnvFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "🔧 To fix this, run:" -ForegroundColor Yellow
    Write-Host "   git rm --cached <filename>" -ForegroundColor White
} else {
    Write-Host "✅ No .env files are tracked in Git" -ForegroundColor Green
}

Write-Host ""

# Check if .env files exist locally
Write-Host "📁 Checking local .env files:" -ForegroundColor Cyan
$localEnvFiles = @()
if (Test-Path "backend/.env") { $localEnvFiles += "backend/.env" }
if (Test-Path "frontend/.env") { $localEnvFiles += "frontend/.env" }
if (Test-Path ".env") { $localEnvFiles += ".env" }

if ($localEnvFiles.Count -gt 0) {
    Write-Host "📄 Found local .env files:" -ForegroundColor Blue
    $localEnvFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Blue }
} else {
    Write-Host "⚠️  No local .env files found" -ForegroundColor Yellow
}

Write-Host ""

# Check .gitignore patterns
Write-Host "🛡️  Checking .gitignore protection:" -ForegroundColor Cyan
$gitignoreFiles = @(".gitignore", "backend/.gitignore", "frontend/.gitignore")
$hasEnvProtection = $false

foreach ($gitignoreFile in $gitignoreFiles) {
    if (Test-Path $gitignoreFile) {
        $content = Get-Content $gitignoreFile -Raw
        if ($content -match "\.env") {
            Write-Host "✅ $gitignoreFile protects .env files" -ForegroundColor Green
            $hasEnvProtection = $true
        }
    }
}

if (-not $hasEnvProtection) {
    Write-Host "❌ WARNING: No .gitignore protection found for .env files!" -ForegroundColor Red
}

Write-Host ""

# Check for sensitive data in staged files
Write-Host "🔍 Checking staged files for sensitive data:" -ForegroundColor Cyan
$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    $sensitivePatterns = @("password", "secret", "key", "token", "api_key")
    $foundSensitive = $false
    
    foreach ($file in $stagedFiles) {
        if ($file -match "\.env") {
            Write-Host "❌ WARNING: .env file is staged: $file" -ForegroundColor Red
            $foundSensitive = $true
        }
    }
    
    if (-not $foundSensitive) {
        Write-Host "✅ No sensitive files in staging area" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No files currently staged" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🔒 Security Check Complete!" -ForegroundColor Yellow

# Summary
Write-Host ""
Write-Host "📋 SUMMARY:" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "============" -ForegroundColor White -BackgroundColor DarkBlue
if ($trackedEnvFiles) {
    Write-Host "❌ Action Required: Remove tracked .env files" -ForegroundColor Red
} else {
    Write-Host "✅ Git Tracking: Clean" -ForegroundColor Green
}

if ($hasEnvProtection) {
    Write-Host "✅ GitIgnore Protection: Active" -ForegroundColor Green
} else {
    Write-Host "❌ GitIgnore Protection: Missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Remember:" -ForegroundColor Cyan
Write-Host "   - Never commit .env files to version control" -ForegroundColor White
Write-Host "   - Use .env.example for template files" -ForegroundColor White
Write-Host "   - Keep sensitive data in .env files only" -ForegroundColor White
Write-Host "   - Run this script before pushing to GitHub" -ForegroundColor White