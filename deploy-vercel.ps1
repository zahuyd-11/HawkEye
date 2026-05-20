# HawkEye Platform - Vercel Deployment Helper Script
# This script helps you prepare and deploy to Vercel

Write-Host "🚀 HawkEye Platform - Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "==============================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "   Please run this script from the Web\hawkeye-platform directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found package.json`n" -ForegroundColor Green

# Step 1: Check Git status
Write-Host "Step 1: Checking Git status..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "   Git not initialized. Initializing..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit - Ready for Vercel deployment"
    Write-Host "   ✅ Git initialized`n" -ForegroundColor Green
} else {
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "   ⚠️  You have uncommitted changes:" -ForegroundColor Yellow
        Write-Host $gitStatus -ForegroundColor Gray
        $commit = Read-Host "   Do you want to commit these changes? (y/n)"
        if ($commit -eq "y" -or $commit -eq "Y") {
            git add .
            $commitMsg = Read-Host "   Enter commit message (or press Enter for default)"
            if ([string]::IsNullOrWhiteSpace($commitMsg)) {
                $commitMsg = "Update before Vercel deployment"
            }
            git commit -m $commitMsg
            Write-Host "   ✅ Changes committed`n" -ForegroundColor Green
        }
    } else {
        Write-Host "   ✅ Git repository is clean`n" -ForegroundColor Green
    }
}

# Step 2: Check for remote
Write-Host "Step 2: Checking Git remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  No remote repository found" -ForegroundColor Yellow
    Write-Host "`n   To add a remote:" -ForegroundColor Cyan
    Write-Host "   1. Create a repository on GitHub" -ForegroundColor White
    Write-Host "   2. Run: git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git" -ForegroundColor White
    Write-Host "   3. Run: git push -u origin main`n" -ForegroundColor White
    
    $addRemote = Read-Host "   Do you want to add a remote now? (y/n)"
    if ($addRemote -eq "y" -or $addRemote -eq "Y") {
        $remoteUrl = Read-Host "   Enter your GitHub repository URL"
        if ($remoteUrl) {
            git remote add origin $remoteUrl
            Write-Host "   ✅ Remote added`n" -ForegroundColor Green
        }
    }
} else {
    Write-Host "   ✅ Remote found: $remote`n" -ForegroundColor Green
}

# Step 3: Generate NEXTAUTH_SECRET
Write-Host "Step 3: Generating NEXTAUTH_SECRET..." -ForegroundColor Yellow
$nextAuthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "   Your NEXTAUTH_SECRET:" -ForegroundColor Cyan
Write-Host "   $nextAuthSecret" -ForegroundColor White
Write-Host "   ⚠️  Save this! You'll need it in Vercel Environment Variables`n" -ForegroundColor Yellow

# Step 4: Check environment variables
Write-Host "Step 4: Environment Variables Checklist" -ForegroundColor Yellow
Write-Host "   Required for Vercel:" -ForegroundColor Cyan
Write-Host "   - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET (see above)" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL (your Vercel URL, e.g., https://your-app.vercel.app)`n" -ForegroundColor White

Write-Host "   Optional:" -ForegroundColor Cyan
Write-Host "   - GOOGLE_CLIENT_ID" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_SECRET" -ForegroundColor Gray
Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" -ForegroundColor Gray
Write-Host "   - STRIPE_WEBHOOK_SECRET`n" -ForegroundColor Gray

# Step 5: Database setup reminder
Write-Host "Step 5: Database Setup" -ForegroundColor Yellow
Write-Host "   Make sure you have a PostgreSQL database ready:" -ForegroundColor Cyan
Write-Host "   - Neon: https://neon.tech (Free tier available)" -ForegroundColor White
Write-Host "   - Supabase: https://supabase.com (Free tier available)" -ForegroundColor White
Write-Host "   - Railway: https://railway.app (Free tier available)`n" -ForegroundColor White

# Step 6: Deployment instructions
Write-Host "Step 6: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "   1. Go to: https://vercel.com/new" -ForegroundColor Cyan
Write-Host "   2. Sign in with GitHub" -ForegroundColor Cyan
Write-Host "   3. Import your repository" -ForegroundColor Cyan
Write-Host "   4. Add environment variables (see Step 4)" -ForegroundColor Cyan
Write-Host "   5. Click Deploy!`n" -ForegroundColor Cyan

# Step 7: After deployment
Write-Host "Step 7: After Deployment" -ForegroundColor Yellow
Write-Host "   1. Update NEXTAUTH_URL with your actual Vercel URL" -ForegroundColor Cyan
Write-Host "   2. Run database migrations:" -ForegroundColor Cyan
Write-Host "      npx prisma db push" -ForegroundColor White
Write-Host "   3. Test your site!`n" -ForegroundColor Cyan

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Ready to deploy! Follow the steps above." -ForegroundColor Green
Write-Host "📖 See DEPLOY_TO_VERCEL.md for detailed guide`n" -ForegroundColor Cyan

# Ask if they want to push to GitHub
if ($remote) {
    $push = Read-Host "Do you want to push to GitHub now? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Pushed to GitHub successfully!" -ForegroundColor Green
            Write-Host "   Now go to https://vercel.com/new to deploy!" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to push. Check your Git configuration." -ForegroundColor Red
        }
    }
}

Write-Host "`n🎉 Good luck with your deployment!`n" -ForegroundColor Green

