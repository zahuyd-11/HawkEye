# 🔧 Environment Variables Setup

## ⚠️ IMPORTANT: Manual Step Required

Since `.env.local` is protected, please **manually update** it with these exact values:

## Step 1: Update `.env.local`

Open `Web/hawkeye-platform/.env.local` and replace ALL contents with:

```env
# Supabase API (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://iskimqdvugljtqepdpdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2ltcWR2dWdsanRxZXBkcGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTAwNTAsImV4cCI6MjA4MDg2NjA1MH0.bLTN69rmw_KTHNzQ64RQxRdXle4c1puD2yPYi5f-UO8

# Database Connection (Server-side / Prisma)
# Password special characters fixed
DATABASE_URL="postgresql://postgres:Andrewl2611%40@db.bqhstpkwneahvytglndp.supabase.co:5432/postgres?schema=public"

# Auth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="piNHwZHlfWg89jfNG2qHTFwOk1qrhiyFsol7QvnYi8M="
```

## Step 2: Restart Dev Server

After updating `.env.local`, **restart your dev server**:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Verification

The Supabase client files are now correctly configured:

- ✅ `src/utils/supabase/client.ts` - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `src/utils/supabase/server.ts` - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `src/utils/supabase/middleware.ts` - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ No hardcoded keys found
- ✅ Proper error handling for missing env vars

## 🎯 What Was Fixed

1. ✅ **QueryProvider** - Created and added to layout.tsx
2. ✅ **Supabase Dependencies** - Installed `@supabase/supabase-js` and `@supabase/ssr`
3. ✅ **Env Variable Validation** - Added checks in all Supabase client files
4. ✅ **Middleware** - Updated with proper env var validation

## 🚀 Next Steps

1. Update `.env.local` manually (see above)
2. Restart dev server
3. Test the app - both errors should be resolved!

