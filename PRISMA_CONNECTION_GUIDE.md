# 🔧 Prisma Connection Fix Guide

## Issue: P1001 "Can't reach database server"

### Root Cause
Prisma is trying to connect to Supabase but the connection string may be incorrect or the port is blocked.

---

## ✅ Solution 1: Standard Connection (Port 5432)

**Update `.env.local`:**

```env
# Direct Connection (for migrations)
DATABASE_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"
```

**Note:** Password is URL-encoded (`%40` = `@`)

---

## ✅ Solution 2: Transaction Pool (Port 6543) - If 5432 is Blocked

**If port 5432 is blocked by firewall/network, use the transaction pool:**

```env
# Connection Pool (for queries - uses pgbouncer)
DATABASE_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:6543/postgres?schema=public&pgbouncer=true"

# Direct Connection (for migrations - MUST use 5432)
DIRECT_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"
```

**Important:**
- `DATABASE_URL` can use port 6543 (transaction pool) for queries
- `DIRECT_URL` MUST use port 5432 for migrations (`prisma migrate`, `prisma db push`)

---

## 🔍 Verification Steps

### Step 1: Update `.env.local`
Add both `DATABASE_URL` and `DIRECT_URL` as shown above.

### Step 2: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 3: Test Connection
```bash
npx prisma db pull
```

If successful, you'll see:
```
✔ Introspected database
```

### Step 4: Verify Schema Sync
```bash
npx prisma db push
```

---

## ⚠️ Common Issues

### Issue 1: "Can't reach database server"
**Cause:** Port 5432 blocked or wrong hostname  
**Fix:** Use port 6543 for `DATABASE_URL` (see Solution 2)

### Issue 2: "Authentication failed"
**Cause:** Wrong password or URL encoding  
**Fix:** Ensure password is URL-encoded (`@` → `%40`, `#` → `%23`, etc.)

### Issue 3: "Schema not found"
**Cause:** Missing `?schema=public` in connection string  
**Fix:** Add `?schema=public` to both URLs

---

## 📝 Complete `.env.local` Template

```env
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://iskimqdvugljtqepdpdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2ltcWR2dWdsanRxZXBkcGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTAwNTAsImV4cCI6MjA4MDg2NjA1MH0.bLTN69rmw_KTHNzQ64RQxRdXle4c1puD2yPYi5f-UO8

# ============================================
# Prisma Database Connection
# ============================================
# Option A: Standard (Port 5432)
DATABASE_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"

# Option B: Transaction Pool (Port 6543) - Use if 5432 is blocked
# DATABASE_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:6543/postgres?schema=public&pgbouncer=true"
# DIRECT_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"

# ============================================
# NextAuth (if using)
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="piNHwZHlfWg89jfNG2qHTFwOk1qrhiyFsol7QvnYi8M="
```

---

## ✅ After Fixing

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Test Prisma:**
   ```bash
   npx prisma studio
   ```
   Should open Prisma Studio if connection works.

3. **Check logs:** No more P1001 errors in console.

---

**The Prisma schema has been fixed (duplicate generator removed).**  
**Just update `.env.local` and regenerate the client!**

