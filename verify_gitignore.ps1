#!/usr/bin/env pwsh

# Script to verify .gitignore is working properly for .env files
# Run with: ./verify_gitignore.ps1

Write-Host "=== Verifying .gitignore Protection for .env Files ===" -ForegroundColor Green

# Function to check if file is ignored by git
function Test-GitIgnore {
    param($FilePath)
    
    $result = git check-ignore $FilePath 2>$null
    return $LASTEXITCODE -eq 0
}

# Test files to check
$testFiles = @(
    "backend/.env",
    "frontend/.env", 
    ".env",
    "backend/.env.local",
    "frontend/.env.local",
    "backend/.env.backup",
    "frontend/.env.production.local"
)

Write-Host "`n1. Checking existing .env files..." -ForegroundColor Yellow

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        if (Test-GitIgnore $file) {
            Write-Host "✓ $file is properly ignored" -ForegroundColor Green
        } else {
            Write-Host "✗ $file is NOT ignored - SECURITY RISK!" -ForegroundColor Red
        }
    } else {
        Write-Host "- $file does not exist" -ForegroundColor Gray
    }
}

Write-Host "`n2. Testing .gitignore with temporary files..." -ForegroundColor Yellow

# Create temporary test files
$tempFiles = @(
    "test.env",
    "backend/test.env", 
    "frontend/test.env"
)

foreach ($file in $tempFiles) {
    # Create directory if it doesn't exist
    $dir = Split-Path $file -Parent
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    # Create test file
    "TEST_VAR=test_value" | Out-File -FilePath $file -Encoding UTF8
    
    if (Test-GitIgnore $file) {
        Write-Host "✓ $file is properly ignored" -ForegroundColor Green
    } else {
        Write-Host "✗ $file is NOT ignored - .gitignore may need updating!" -ForegroundColor Red
    }
    
    # Clean up test file
    Remove-Item $file -Force -ErrorAction SilentlyContinue
}

Write-Host "`n3. Checking git status for any .env files..." -ForegroundColor Yellow

$gitStatus = git status --porcelain 2>$null | Where-Object { $_ -match "\.env" }

if ($gitStatus) {
    Write-Host "✗ Found .env files in git status:" -ForegroundColor Red
    $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    Write-Host "These files should be added to .gitignore!" -ForegroundColor Red
} else {
    Write-Host "✓ No .env files found in git status" -ForegroundColor Green
}

Write-Host "`n4. Checking git history for .env files..." -ForegroundColor Yellow

$envInHistory = git log --all --full-history --name-only -- "*.env" "*/.env" 2>$null | Where-Object { $_ -match "\.env" }

if ($envInHistory) {
    Write-Host "⚠️  Found .env files in git history:" -ForegroundColor Yellow
    $envInHistory | Select-Object -Unique | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    Write-Host "Consider removing these from git history if they contain sensitive data!" -ForegroundColor Yellow
} else {
    Write-Host "✓ No .env files found in git history" -ForegroundColor Green
}

Write-Host "`n5. Verifying .gitignore files exist..." -ForegroundColor Yellow

$gitignoreFiles = @(
    ".gitignore",
    "backend/.gitignore",
    "frontend/.gitignore"
)

foreach ($file in $gitignoreFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
        
        # Check if it contains .env patterns
        $content = Get-Content $file -Raw
        if ($content -match "\.env") {
            Write-Host "  ✓ Contains .env patterns" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Does not contain .env patterns" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ $file is missing" -ForegroundColor Red
    }
}

Write-Host "`n=== Verification Complete ===" -ForegroundColor Green

Write-Host "`nSecurity Recommendations:" -ForegroundColor Cyan
Write-Host "1. Never commit .env files to version control" -ForegroundColor White
Write-Host "2. Use .env.example files for documentation" -ForegroundColor White
Write-Host "3. Set restrictive file permissions: chmod 600 .env" -ForegroundColor White
Write-Host "4. Rotate credentials regularly" -ForegroundColor White
Write-Host "5. Use different credentials for different environments" -ForegroundColor White

if ($gitStatus -or $envInHistory) {
    Write-Host "`n⚠️  ACTION REQUIRED: Review the issues found above!" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ All checks passed! Your .env files are properly protected." -ForegroundColor Green
}