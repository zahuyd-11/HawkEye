# 🗄️ Supabase + Prisma Connection Pooling Setup Guide

This guide explains how to configure Prisma with Supabase Connection Pooling to avoid "Too many connections" errors in production.

---

## 📋 Overview

Supabase provides two connection modes:

1. **Transaction Pooler** (Port 6543) - For application queries
   - Handles connection pooling automatically
   - Prevents "Too many connections" errors
   - Use with `?pgbouncer=true` parameter

2. **Direct Connection** (Port 5432) - For migrations
   - Bypasses connection pooling
   - Required for Prisma migrations
   - Only used during `prisma migrate` or `prisma db push`

---

## 🔧 Prisma Schema Configuration

The `schema.prisma` file is already configured correctly:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Transaction Pooler (Port 6543)
  directUrl = env("DIRECT_URL")        // Direct Connection (Port 5432)
}
```

**What this means:**
- `url` (DATABASE_URL): Used for all Prisma Client queries in your application
- `directUrl` (DIRECT_URL): Used ONLY when running migrations

---

## 🔑 Environment Variables Setup

### For Local Development (`.env`)

```bash
# Transaction Pooler - For queries
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection - For migrations
DIRECT_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

### For Production (Vercel Environment Variables)

1. Go to **Vercel Dashboard** > Your Project > **Settings** > **Environment Variables**

2. Add these two variables:

   **Variable 1:**
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - **Environment:** Production, Preview, Development

   **Variable 2:**
   - **Name:** `DIRECT_URL`
   - **Value:** `postgresql://postgres.xxxxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`
   - **Environment:** Production, Preview, Development

---

## 📍 Getting Your Supabase Connection Strings

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Navigate to **Settings** > **Database**

### Step 2: Find Connection Strings
Scroll down to the **Connection string** section. You'll see:

**Transaction mode (Recommended for connection pooling):**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Direct connection (For migrations):**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### Step 3: Add Parameters
- **For DATABASE_URL:** Add `?pgbouncer=true` at the end
- **For DIRECT_URL:** Use as-is (no parameters needed)

---

## 🚀 Usage

### Running Migrations

When you run migrations, Prisma automatically uses `DIRECT_URL`:

```bash
# This uses DIRECT_URL automatically
npx prisma migrate dev

# Or
npx prisma db push
```

### Application Queries

All Prisma Client queries in your application use `DATABASE_URL`:

```typescript
// This uses DATABASE_URL (Transaction Pooler)
const users = await prisma.user.findMany();
```

---

## ⚠️ Important Notes

### ✅ DO:
- ✅ Use `DATABASE_URL` (Port 6543) for all application queries
- ✅ Use `DIRECT_URL` (Port 5432) only for migrations
- ✅ Add `?pgbouncer=true` to `DATABASE_URL`
- ✅ Keep both URLs in your `.env` file
- ✅ Set both in Vercel Environment Variables

### ❌ DON'T:
- ❌ Don't use `DIRECT_URL` for application queries (will cause connection errors)
- ❌ Don't forget `?pgbouncer=true` in `DATABASE_URL`
- ❌ Don't commit `.env` file to Git
- ❌ Don't use the same URL for both variables

---

## 🔍 Troubleshooting

### Error: "Too many connections"
**Solution:** Make sure you're using `DATABASE_URL` with `?pgbouncer=true` for queries.

### Error: "Migration failed"
**Solution:** Make sure `DIRECT_URL` is set correctly (Port 5432, no pgbouncer parameter).

### Error: "Connection refused"
**Solution:** 
1. Check your Supabase project is active
2. Verify the host, port, and credentials
3. Check Supabase firewall settings

---

## 📚 Additional Resources

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Pooling Guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#connection-pooling)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] `DATABASE_URL` uses Port **6543** with `?pgbouncer=true`
- [ ] `DIRECT_URL` uses Port **5432** without pgbouncer parameter
- [ ] Both URLs are set in Vercel Environment Variables
- [ ] `schema.prisma` has both `url` and `directUrl` fields
- [ ] Migrations run successfully with `npx prisma migrate deploy`
- [ ] Application queries work without connection errors

---

*Last updated: December 2024*

