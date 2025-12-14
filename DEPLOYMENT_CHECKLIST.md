# 🚀 HawkEye Deployment Checklist - Supabase + Vercel

## ✅ Prisma Schema Status

**Status:** ✅ **Already Configured Correctly**

Your `prisma/schema.prisma` already has the correct configuration:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Transaction Pooler (Port 6543)
  directUrl = env("DIRECT_URL")        // Direct Connection (Port 5432)
}
```

**No changes needed!** ✅

---

## 🔑 Environment Variables Required

### For Vercel Deployment:

You need to set **TWO** environment variables in Vercel:

#### 1. DATABASE_URL (Transaction Pooler)
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Key Points:**
- ✅ Port: **6543** (Transaction Pooler)
- ✅ Must include: `?pgbouncer=true`
- ✅ Used for: All application queries

#### 2. DIRECT_URL (Direct Connection)
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

**Key Points:**
- ✅ Port: **5432** (Direct Connection)
- ✅ No parameters needed
- ✅ Used for: Migrations only

---

## 📝 Step-by-Step Vercel Setup

### Step 1: Get Supabase Connection Strings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **Database**
4. Scroll to **Connection string** section
5. Copy both connection strings

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add each variable:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - Environment: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Key: `DIRECT_URL`
   - Value: `postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`
   - Environment: ✅ Production, ✅ Preview, ✅ Development

### Step 3: Run Migrations

After deployment, run migrations:

```bash
# In Vercel, use the Vercel CLI or add to build command
npx prisma migrate deploy
```

Or manually via Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

---

## 🔍 Quick Reference

| Variable | Port | Parameters | Usage |
|----------|------|------------|-------|
| `DATABASE_URL` | 6543 | `?pgbouncer=true` | Application queries |
| `DIRECT_URL` | 5432 | None | Migrations only |

---

## ⚠️ Common Mistakes to Avoid

1. ❌ **Using same URL for both** - They must be different ports
2. ❌ **Forgetting `?pgbouncer=true`** - Required for connection pooling
3. ❌ **Using DIRECT_URL for queries** - Will cause connection errors
4. ❌ **Using DATABASE_URL for migrations** - Migrations need direct connection

---

## ✅ Verification

After setting up, verify:

```bash
# Check if Prisma can connect
npx prisma db pull

# Run a test query (uses DATABASE_URL)
npx prisma studio
```

---

## 📚 Additional Files Created

- ✅ `.env.example` - Template with detailed comments
- ✅ `SUPABASE_SETUP.md` - Comprehensive setup guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This file

---

**Ready to deploy!** 🚀

