# Script tự động cài đặt Git trên Windows
# Chạy với quyền Administrator: Right-click → Run as Administrator

Write-Host "🔧 Đang kiểm tra và cài đặt Git..." -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem Git đã được cài đặt chưa
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if ($gitInstalled) {
    Write-Host "✅ Git đã được cài đặt!" -ForegroundColor Green
    git --version
    exit 0
}

Write-Host "⚠️  Git chưa được cài đặt. Đang cài đặt..." -ForegroundColor Yellow
Write-Host ""

# Method 1: Thử dùng winget (Windows Package Manager)
$wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue

if ($wingetAvailable) {
    Write-Host "📦 Đang cài Git bằng winget..." -ForegroundColor Cyan
    try {
        winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
        Write-Host ""
        Write-Host "✅ Git đã được cài đặt thành công bằng winget!" -ForegroundColor Green
        Write-Host "⚠️  Vui lòng đóng và mở lại PowerShell để sử dụng Git" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Hoặc chạy lệnh sau để refresh PATH:" -ForegroundColor Cyan
        Write-Host '$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")' -ForegroundColor White
        exit 0
    } catch {
        Write-Host "❌ Không thể cài Git bằng winget: $_" -ForegroundColor Red
    }
}

# Method 2: Thử dùng Chocolatey
$chocoAvailable = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoAvailable) {
    Write-Host "📦 Đang cài Git bằng Chocolatey..." -ForegroundColor Cyan
    try {
        choco install git -y
        Write-Host ""
        Write-Host "✅ Git đã được cài đặt thành công bằng Chocolatey!" -ForegroundColor Green
        Write-Host "⚠️  Vui lòng đóng và mở lại PowerShell để sử dụng Git" -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "❌ Không thể cài Git bằng Chocolatey: $_" -ForegroundColor Red
    }
}

# Method 3: Hướng dẫn cài thủ công
Write-Host ""
Write-Host "❌ Không thể cài Git tự động." -ForegroundColor Red
Write-Host ""
Write-Host "📥 Vui lòng cài Git thủ công:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Tải Git for Windows" -ForegroundColor Cyan
Write-Host "  1. Truy cập: https://git-scm.com/download/win" -ForegroundColor White
Write-Host "  2. Tải và chạy installer" -ForegroundColor White
Write-Host "  3. Chọn 'Add Git to PATH' khi cài đặt" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Cài winget (nếu chưa có)" -ForegroundColor Cyan
Write-Host "  - Windows 11: Đã có sẵn winget" -ForegroundColor White
Write-Host "  - Windows 10: Tải từ Microsoft Store" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Cài Chocolatey trước" -ForegroundColor Cyan
Write-Host "  - Truy cập: https://chocolatey.org/install" -ForegroundColor White
Write-Host "  - Chạy lệnh: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor White
Write-Host ""

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Lưu ý: Một số phương pháp cài đặt cần quyền Administrator" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Sau khi cài Git, đóng và mở lại PowerShell, sau đó chạy:" -ForegroundColor Cyan
Write-Host "  git --version" -ForegroundColor White
Write-Host ""


