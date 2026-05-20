@echo off
echo 🚀 Starting HawkEye Platform...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Check if Prisma Client is generated
if not exist "node_modules\.prisma" (
    echo 🗄️ Generating Prisma Client...
    call npm run db:generate
    echo.
)

REM Clear cache
echo 🧹 Clearing cache...
if exist ".next" rmdir /s /q .next
echo ✅ Cache cleared!
echo.

REM Start dev server
echo 🌐 Starting development server...
echo    Opening http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev












