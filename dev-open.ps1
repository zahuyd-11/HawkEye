# Script to start Next.js dev server and open browser
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Sleep -Seconds 5
Write-Host "Opening browser at http://localhost:3000" -ForegroundColor Green
Start-Process "http://localhost:3000"

