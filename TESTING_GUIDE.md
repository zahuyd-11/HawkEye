# Testing Guide for HawkEye Platform

## Quick Start Testing (3 Options)

### Option 1: Using Supabase (Free, Easiest) ⭐ Recommended

1. **Create a free Supabase account:**
   - Go to https://supabase.com
   - Sign up for free
   - Create a new project

2. **Get your database URL:**
   - In Supabase dashboard, go to Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

3. **Update .env file:**
   ```env
   DATABASE_URL="your-supabase-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

4. **Generate NextAuth secret:**
   ```bash
   # On Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   
   # Or use online tool: https://generate-secret.vercel.app/32
   ```

5. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

7. **Open browser:**
   - Go to http://localhost:3000
   - You should see the landing page!

---

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL:**
   - Download from https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember your postgres user password

2. **Create database:**
   ```sql
   -- Open pgAdmin or psql
   CREATE DATABASE hawkeye;
   ```

3. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hawkeye?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret"
   ```

4. **Continue with steps 5-7 from Option 1**

---

### Option 3: Using SQLite (Simplest, but requires schema change)

If you want the absolute simplest setup without any database server:

1. **Change Prisma schema to SQLite:**
   - Edit `prisma/schema.prisma`
   - Change line 9 from `provider = "postgresql"` to `provider = "sqlite"`
   - Change line 10 to `url      = "file:./dev.db"`

2. **Update .env:**
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret"
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

---

## Testing the Application

### 1. Test Landing Page
- Open http://localhost:3000
- You should see the HawkEye landing page
- Test navigation links
- Check responsive design (resize browser)

### 2. Test Authentication

**Sign Up:**
- Click "Start Free" or go to http://localhost:3000/auth/signup
- Fill in name, email, password
- Click "Create Account"
- You should be redirected to sign in

**Sign In:**
- Go to http://localhost:3000/auth/signin
- Enter your credentials
- You should be redirected to dashboard

### 3. Test Dashboard
- After signing in, you should see the dashboard
- Check stats widgets
- Test navigation to different sections

### 4. Test DealDigest
- Go to Dashboard → DealDigest
- You should see the list (empty initially)
- Test filters and search

### 5. Test TradePlan Builder
- Go to Dashboard → TradePlan
- Click "New Plan"
- Fill in a trade plan
- Test the risk calculator
- Save and view the plan

### 6. Test Micro Research
- Go to Dashboard → Micro Research
- Test filters and pagination

### 7. Test Admin Panel
- First, create an admin user in the database:
  ```sql
  UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
  ```
- Go to http://localhost:3000/admin
- You should see the admin dashboard

---

## Creating Test Data

### Add a Sample DealDigest (via Admin or Database)

```sql
INSERT INTO deal_digests (
  id, ticker, "companyName", sector, industry, "marketCap",
  "businessOverview", "financialHealth", "growthCatalysts", "riskFactors",
  "riskScore", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'sample-1',
  'VCB',
  'Vietcombank',
  'Banking',
  'Commercial Banks',
  'Large (20,000 - 50,000 tỷ VND)',
  'Vietcombank is one of the largest banks in Vietnam...',
  'Strong financial position with healthy capital ratios...',
  'Digital transformation initiatives...',
  'Regulatory changes, interest rate volatility...',
  5,
  NOW(),
  NOW(),
  NOW()
);
```

### Add Sample Micro Research

```sql
INSERT INTO micro_research (
  id, title, ticker, "companyName", sector, industry, "marketCap",
  content, tags, "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'research-1',
  'Banking Sector Outlook Q1 2024',
  'VCB',
  'Vietcombank',
  'Banking',
  'Commercial Banks',
  'Large (20,000 - 50,000 tỷ VND)',
  'The banking sector shows strong growth potential...',
  ARRAY['Banking', 'Finance', 'VN30'],
  NOW(),
  NOW(),
  NOW()
);
```

---

## Common Issues & Solutions

### Issue: "Prisma Client not generated"
**Solution:**
```bash
npx prisma generate
```

### Issue: "Database connection error"
**Solution:**
- Check your DATABASE_URL in .env
- Make sure PostgreSQL is running (if using local)
- Verify Supabase connection string is correct

### Issue: "NextAuth secret not set"
**Solution:**
- Generate a secret and add to .env
- Restart the dev server after adding

### Issue: "Module not found"
**Solution:**
```bash
npm install
```

### Issue: "Port 3000 already in use"
**Solution:**
- Kill the process using port 3000
- Or change port in package.json scripts

---

## Testing Checklist

- [ ] Landing page loads
- [ ] Navigation works
- [ ] Sign up works
- [ ] Sign in works
- [ ] Dashboard loads
- [ ] DealDigest page loads
- [ ] TradePlan page loads
- [ ] Micro Research page loads
- [ ] Filters work
- [ ] Search works
- [ ] Admin panel accessible (with admin user)
- [ ] Responsive design works on mobile

---

## Next Steps After Testing

1. **Add real data** - Create actual DealDigest reports
2. **Configure Stripe** - Set up payment processing
3. **Set up email** - Configure SMTP for emails
4. **Deploy** - Deploy to Vercel, Railway, or your preferred platform

---

## Need Help?

- Check the README.md for more details
- Review IMPLEMENTATION.md for feature list
- Check console for error messages
- Verify all environment variables are set

Happy testing! 🚀

