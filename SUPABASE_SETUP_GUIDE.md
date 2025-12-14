# 🚀 Supabase Setup Guide - Phase 3

## Step 1: Install Supabase Packages

Run this command in your terminal:

```powershell
cd Web\hawkeye-platform
npm install @supabase/supabase-js @supabase/ssr
```

## Step 2: Create Supabase Project

1. **Go to https://supabase.com**
2. **Sign up** (or log in if you have an account)
3. **Click "New Project"**
4. **Fill in the details:**
   - **Name**: `hawkeye-platform` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to Vietnam (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Free tier is fine for development

5. **Wait 2-3 minutes** for the project to be created

## Step 3: Get Your Supabase Credentials

Once your project is ready:

1. **Go to Project Settings** (gear icon in left sidebar)
2. **Click on "API"** in the settings menu
3. **Copy these values:**
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (keep this secret! Only for server-side)

4. **Go to "Database"** → **Connection string**
   - Copy the **URI** connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

## Step 4: Create `.env.local` File

Create a file named `.env.local` in the `Web/hawkeye-platform` folder with this content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (optional - if you want to keep Prisma for some features)
DATABASE_URL=your-supabase-connection-string-here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google OAuth (if you want to keep Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Replace the placeholder values with your actual Supabase credentials!**

## Step 5: Run the SQL Schema

1. **In Supabase Dashboard**, go to **SQL Editor** (left sidebar)
2. **Click "New Query"**
3. **Copy and paste the SQL code** from `SUPABASE_SCHEMA.sql` (I'll create this file)
4. **Click "Run"** (or press Ctrl+Enter)
5. **Verify** that all tables are created successfully

## Step 6: Test the Setup

1. **Start your dev server:**
   ```powershell
   npm run dev
   ```

2. **Visit http://localhost:3000/login**
3. **Try registering a new account**
4. **Check Supabase Dashboard** → **Authentication** → **Users** to see your new user

---

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you copied the **anon key**, not the service_role key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after changing `.env.local`

### "Connection refused" error
- Check your Supabase project is active (not paused)
- Verify your connection string is correct
- Make sure your IP is allowed (Supabase allows all IPs by default on free tier)

### Database tables not showing
- Make sure you ran the SQL schema in the SQL Editor
- Check the "Table Editor" in Supabase Dashboard to see your tables

---

**Next Steps**: After setup, the auth pages will be ready at `/login` and `/register`!

