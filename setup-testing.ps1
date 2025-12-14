# HawkEye Platform Testing Setup Script
# Run this script to set up the environment for testing

Write-Host "Setting up HawkEye Platform for Testing..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (Test-Path .env) {
    Write-Host "WARNING: .env file already exists. Skipping creation." -ForegroundColor Yellow
    Write-Host "   If you want to recreate it, delete .env first." -ForegroundColor Yellow
} else {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    
    # Generate NextAuth secret
    $nextAuthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
    
    $envContent = @"
# Database
# IMPORTANT: Update this with your database connection string
# Options:
# 1. Supabase (free): Get from https://supabase.com
# 2. Local PostgreSQL: postgresql://postgres:password@localhost:5432/hawkeye
# 3. Railway/Neon: Get from their dashboard
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hawkeye?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$nextAuthSecret"

# Google OAuth (Optional - leave empty for testing)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (Optional - leave empty for testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Market Data API (Optional)
MARKET_DATA_API_KEY=""

# Email (Optional)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
"@
    
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "SUCCESS: .env file created!" -ForegroundColor Green
    Write-Host "   IMPORTANT: Update DATABASE_URL with your actual database connection string" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Cyan

if (Test-Path node_modules) {
    Write-Host "SUCCESS: Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "Database Setup Instructions:" -ForegroundColor Cyan
Write-Host "   1. Choose a database option:" -ForegroundColor White
Write-Host "      - Supabase (free, easiest): https://supabase.com" -ForegroundColor White
Write-Host "      - Local PostgreSQL: Install from postgresql.org" -ForegroundColor White
Write-Host "      - Railway/Neon: Free PostgreSQL hosting" -ForegroundColor White
Write-Host ""
Write-Host "   2. Update DATABASE_URL in .env file" -ForegroundColor White
Write-Host ""
Write-Host "   3. Run these commands:" -ForegroundColor White
Write-Host "      npx prisma generate" -ForegroundColor Yellow
Write-Host "      npx prisma db push" -ForegroundColor Yellow
Write-Host ""
Write-Host "   4. Start the development server:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "   5. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setup complete! Follow the instructions above to continue." -ForegroundColor Green
