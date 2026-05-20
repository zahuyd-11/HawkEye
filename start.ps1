# PowerShell script để chạy web
# Chạy: .\start.ps1

Write-Host "🚀 Starting HawkEye Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if Prisma Client is generated
if (-not (Test-Path "node_modules\.prisma")) {
    Write-Host "🗄️ Generating Prisma Client..." -ForegroundColor Yellow
    npm run db:generate
    Write-Host ""
}

# Clear cache
Write-Host "🧹 Clearing cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "✅ Cache cleared!" -ForegroundColor Green
Write-Host ""

# Start dev server
Write-Host "🌐 Starting development server..." -ForegroundColor Cyan
Write-Host "   Opening http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev












