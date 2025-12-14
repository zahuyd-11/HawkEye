# 🔧 Environment Variables Fix - Instructions

## ✅ Codebase Status

**Good News:** The codebase is already using the **correct** variable names:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

All Supabase utility files are correctly configured.

## 📝 Action Required: Update `.env.local`

You need to manually update your `.env.local` file in the root directory.

### Step 1: Open `.env.local`

Navigate to: `Web/hawkeye-platform/.env.local`

### Step 2: Replace with This Content

```env
NEXT_PUBLIC_SUPABASE_URL=https://iskimqdvugljtqepdpdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2ltcWR2dWdsanRxZXBkcGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTAwNTAsImV4cCI6MjA4MDg2NjA1MH0.bLTN69rmw_KTHNzQ64RQxRdXle4c1puD2yPYi5f-UO8
```

### Step 3: Remove Old Variable (if exists)

**DELETE this line if it exists:**
```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

### Step 4: Verify

After updating, restart your dev server:
```bash
npm run dev
```

## ✅ Verification Checklist

- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `PUBLISHABLE_DEFAULT_KEY`)
- [ ] No old variable names remain
- [ ] Dev server restarted
- [ ] No Supabase connection errors in console

## 📁 Files Using These Variables

All these files are correctly configured and will work once `.env.local` is updated:

1. ✅ `src/utils/supabase/client.ts`
2. ✅ `src/utils/supabase/server.ts`
3. ✅ `src/utils/supabase/middleware.ts`
4. ✅ `src/lib/supabase/client.ts` (duplicate, also correct)
5. ✅ `src/lib/supabase/server.ts` (duplicate, also correct)
6. ✅ `src/lib/supabase/middleware.ts` (duplicate, also correct)

## 🔍 How to Check Current Values

You can verify your current `.env.local` by running:
```bash
# Windows PowerShell
Get-Content .env.local

# Or check in your editor
```

## ⚠️ Important Notes

1. **Variable Names:**
   - ✅ Use: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ❌ Don't use: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

2. **No Quotes Needed:**
   - ✅ `NEXT_PUBLIC_SUPABASE_URL=https://...`
   - ❌ `NEXT_PUBLIC_SUPABASE_URL="https://..."`

3. **No Spaces:**
   - ✅ `KEY=value`
   - ❌ `KEY = value`

4. **Restart Required:**
   - After changing `.env.local`, you MUST restart the dev server
   - Environment variables are loaded at startup

## 🚀 After Fixing

Once you update `.env.local`:
1. Stop the dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Try signing up - should work without errors!

---

**The codebase is ready - you just need to update the `.env.local` file!** ✅

