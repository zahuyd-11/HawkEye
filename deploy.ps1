# PowerShell script để deploy lên Vercel
# Chạy: .\deploy.ps1

Write-Host "🚀 HawkEye Platform - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Khong tim thay package.json" -ForegroundColor Red
    Write-Host "   Chay script nay trong thu muc Web/hawkeye-platform" -ForegroundColor Yellow
    exit 1
}

# Step 1: Test build
Write-Host "📦 Step 1: Testing build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Check Git
Write-Host "📤 Step 2: Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git repository chua duoc khoi tao" -ForegroundColor Yellow
    Write-Host "   Dang khoi tao..."
    git init
    git add .
    git commit -m "Initial commit - Ready for Vercel"
    Write-Host "✅ Git initialized!" -ForegroundColor Green
} else {
    $status = git status --porcelain
    if ($status) {
        Write-Host "⚠️  Co thay doi chua commit" -ForegroundColor Yellow
        Write-Host "   Dang commit..."
        git add .
        git commit -m "Update before deployment"
        Write-Host "✅ Changes committed!" -ForegroundColor Green
    } else {
        Write-Host "✅ Git repository ready!" -ForegroundColor Green
    }
}
Write-Host ""

# Step 3: Check remote
Write-Host "🔗 Step 3: Checking GitHub remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "⚠️  Chua co GitHub remote" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Buoc tiep theo:" -ForegroundColor Cyan
    Write-Host "   1. Tao repository tren GitHub.com" -ForegroundColor White
    Write-Host "   2. Chay lenh sau (thay YOUR_USERNAME):" -ForegroundColor White
    Write-Host "      git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git" -ForegroundColor Gray
    Write-Host "      git push -u origin main" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✅ Remote: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 De push len GitHub, chay:" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host ""
}
Write-Host ""

# Step 4: Instructions
Write-Host "🌐 Step 4: Deploy len Vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Buoc tiep theo:" -ForegroundColor Cyan
Write-Host "   1. Truy cap: https://vercel.com/new" -ForegroundColor White
Write-Host "   2. Dang nhap bang GitHub" -ForegroundColor White
Write-Host "   3. Import repository: hawkeye-platform" -ForegroundColor White
Write-Host "   4. Add Environment Variables:" -ForegroundColor White
Write-Host "      - DATABASE_URL" -ForegroundColor Gray
Write-Host "      - NEXTAUTH_SECRET (chay: npm run generate:secret)" -ForegroundColor Gray
Write-Host "      - NEXTAUTH_URL (se update sau)" -ForegroundColor Gray
Write-Host "   5. Click Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "✅ Sau khi deploy, ban se co link public!" -ForegroundColor Green
Write-Host ""

# Step 5: Generate secret
Write-Host "🔐 Step 5: Generate NEXTAUTH_SECRET?" -ForegroundColor Yellow
$generate = Read-Host "   Generate secret now? (y/n)"
if ($generate -eq "y" -or $generate -eq "Y") {
    Write-Host ""
    Write-Host "🔑 Generated NEXTAUTH_SECRET:" -ForegroundColor Cyan
    $secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
    Write-Host $secret -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Add this to Vercel Environment Variables:" -ForegroundColor Yellow
    Write-Host "   Name: NEXTAUTH_SECRET" -ForegroundColor Gray
    Write-Host "   Value: $secret" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "🎉 Hoan thanh! Chuyen sang Vercel de deploy!" -ForegroundColor Green
Write-Host ""

