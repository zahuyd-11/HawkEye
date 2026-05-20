# 🚀 Deploy HawkEye Platform to Vercel

Complete step-by-step guide to deploy your website on Vercel.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ PostgreSQL database (Neon, Supabase, or Railway - all have free tiers)

---

## Step 1: Prepare Your Code

### 1.1 Navigate to Project Directory

```powershell
cd Web\hawkeye-platform
```

### 1.2 Initialize Git (if not already done)

```powershell
# Check if git is initialized
git status

# If not initialized:
git init
git add .
git commit -m "Ready for Vercel deployment"
```

### 1.3 Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it: `hawkeye-platform` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

```powershell
# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Database

You need a PostgreSQL database. Here are free options:

### Option A: Neon (Recommended - Free Tier)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
5. **Save this for Step 3!**

### Option B: Supabase (Free Tier)

1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the connection string under "Connection pooling"
5. **Save this for Step 3!**

### Option C: Railway (Free Tier)

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Add PostgreSQL
4. Copy the connection string from the database service
5. **Save this for Step 3!**

---

## Step 3: Deploy on Vercel

### 3.1 Import Project

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click **"Import"** next to your `hawkeye-platform` repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Project Settings

**Project Name:** `hawkeye-platform` (or your choice)

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (default)

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

#### Required Variables:

```
DATABASE_URL=your_postgresql_connection_string_here
```

```
NEXTAUTH_SECRET=generate_a_random_secret_here
```

To generate NEXTAUTH_SECRET, run in PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Or use: https://generate-secret.vercel.app/32

```
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Note:** You'll update this after first deployment with your actual Vercel URL.

#### Optional Variables (add if you have them):

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

```
MARKET_DATA_API_KEY=your_market_data_api_key
```

### 3.4 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. ✅ Your site will be live at: `https://your-app-name.vercel.app`

---

## Step 4: Set Up Database Schema

After deployment, you need to run Prisma migrations:

### Option 1: Using Vercel CLI (Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
cd Web\hawkeye-platform
vercel link

# Run Prisma migrations
npx prisma db push
```

### Option 2: Using Database Provider Dashboard

1. Go to your database provider (Neon/Supabase/Railway)
2. Open SQL Editor
3. Run the Prisma schema manually (or use Prisma Studio)

### Option 3: Using Prisma Migrate

```powershell
cd Web\hawkeye-platform
npx prisma migrate deploy
```

---

## Step 5: Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Set it to: `https://your-actual-app-name.vercel.app`
4. Redeploy (or it will auto-update on next push)

---

## Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Test the homepage
3. Try signing up/signing in
4. Check if database connections work

---

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
- Solution: The `postinstall` script should handle this. If not, check that `prisma generate` runs during build.

**Error: "DATABASE_URL not found"**
- Solution: Make sure you added `DATABASE_URL` in Vercel Environment Variables.

**Error: "NEXTAUTH_SECRET not found"**
- Solution: Add `NEXTAUTH_SECRET` in Vercel Environment Variables.

### Database Connection Issues

**Error: "Can't reach database server"**
- Check your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel IPs
- For Neon/Supabase: Use connection pooling URL

**Error: "Schema not found"**
- Run `npx prisma db push` or `npx prisma migrate deploy`
- Check Prisma schema is correct

### Authentication Issues

**Error: "NEXTAUTH_URL mismatch"**
- Update `NEXTAUTH_URL` to match your Vercel domain
- Redeploy after updating

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Database created (Neon/Supabase/Railway)
- [ ] Vercel project created
- [ ] Environment variables added:
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
- [ ] Deployed successfully
- [ ] Database schema pushed
- [ ] Site tested and working

---

## Next Steps

1. **Custom Domain:** Add your domain in Vercel Settings → Domains
2. **Analytics:** Enable Vercel Analytics in project settings
3. **Monitoring:** Set up error tracking (Sentry, etc.)
4. **CI/CD:** Every push to `main` branch auto-deploys!

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check database connection
3. Verify all environment variables are set
4. Check Next.js console for errors

---

**🎉 Congratulations! Your website is now live on Vercel!**

Your site URL: `https://your-app-name.vercel.app`

