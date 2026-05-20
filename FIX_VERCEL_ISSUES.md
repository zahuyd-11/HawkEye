# 🔧 Fix Vercel Deployment Issues

## Common Issues and Fixes

### 1. Missing Environment Variables

**Error:** `NEXTAUTH_SECRET is missing` or `DATABASE_URL is missing`

**Fix:** Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://hawkeye-p7p4jw4of-huy-dangs-projects-fe01e4ed.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Database Connection Issues

**Error:** `Can't reach database server` or `Connection timeout`

**Fix:**
- Check your `DATABASE_URL` is correct
- For Neon/Supabase: Use connection pooling URL (not direct connection)
- Ensure database allows connections from Vercel IPs
- Check if database is paused (Neon free tier pauses after inactivity)

### 3. Prisma Client Not Generated

**Error:** `@prisma/client did not initialize yet`

**Fix:** The `postinstall` script should handle this. If not:
- Check Vercel build logs
- Ensure `prisma generate` runs during build
- Verify `package.json` has `postinstall: "prisma generate"`

### 4. NextAuth Configuration Issues

**Error:** `[next-auth][error][NO_SECRET]` or authentication not working

**Fix:**
- Ensure `NEXTAUTH_SECRET` is set in Vercel
- Update `NEXTAUTH_URL` to match your Vercel domain
- Check auth route is accessible: `/api/auth/signin`

### 5. Build Errors

**Error:** TypeScript errors or module not found

**Fix:**
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Try clearing `.next` folder and rebuilding

### 6. Runtime Errors

**Error:** `500 Internal Server Error` or blank page

**Fix:**
- Check Vercel Function Logs
- Verify environment variables are set
- Check database connection
- Ensure Prisma schema is pushed to database

---

## Quick Fix Checklist

1. ✅ **Environment Variables Added:**
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (with your actual Vercel URL)

2. ✅ **Database Setup:**
   - Database created and running
   - Schema pushed: `npx prisma db push`
   - Connection string is correct

3. ✅ **Build Success:**
   - Check Vercel build logs
   - No TypeScript errors
   - Prisma client generated

4. ✅ **Runtime Working:**
   - Homepage loads
   - API routes respond
   - Database queries work

---

## Step-by-Step Fix for Your Deployment

### Step 1: Check Environment Variables

Go to: https://vercel.com/your-project/settings/environment-variables

Ensure you have:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://hawkeye-p7p4jw4of-huy-dangs-projects-fe01e4ed.vercel.app
```

### Step 2: Update NEXTAUTH_URL

If you haven't updated it yet:
1. Copy your Vercel URL: `https://hawkeye-p7p4jw4of-huy-dangs-projects-fe01e4ed.vercel.app`
2. Add/Update `NEXTAUTH_URL` in Vercel Environment Variables
3. Redeploy

### Step 3: Check Database

1. Verify database is running (not paused)
2. Test connection string locally
3. Run migrations: `npx prisma db push`

### Step 4: Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check "Build Logs" for errors
4. Check "Function Logs" for runtime errors

### Step 5: Test API Routes

Test these endpoints:
- `/api/auth/signin` - Should show sign in page
- `/api/market-data` - Should return JSON
- `/api/dashboard/stats` - Should work if authenticated

---

## If Still Not Working

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check for error messages

2. **Test Locally:**
   ```powershell
   npm run build
   npm start
   ```
   See if same errors occur

3. **Redeploy:**
   - Push a new commit to trigger redeploy
   - Or manually redeploy in Vercel Dashboard

4. **Contact Support:**
   - Share Vercel build logs
   - Share function error logs
   - Describe what's not working

---

## Your Current URL

**Vercel URL:** https://hawkeye-p7p4jw4of-huy-dangs-projects-fe01e4ed.vercel.app

Make sure `NEXTAUTH_URL` matches this exactly!

