# 🚀 Hướng dẫn Deploy Website - Cho người khác truy cập

## 📋 Tổng quan

Có nhiều cách để deploy website lên internet. **Vercel** là cách dễ nhất và miễn phí cho Next.js.

---

## 🎯 Option 1: Vercel (Recommended - Miễn phí)

### Bước 1: Chuẩn bị code

1. **Đảm bảo code đã commit lên Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Tạo file `.vercelignore`** (optional):
   ```
   node_modules
   .env
   .env.local
   .next
   ```

### Bước 2: Deploy lên Vercel

1. **Truy cập:** https://vercel.com
2. **Đăng ký/Đăng nhập** bằng GitHub account
3. **Click "Add New Project"**
4. **Import Git Repository:**
   - Chọn repository của bạn
   - Hoặc connect GitHub account
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `Web/hawkeye-platform` (nếu repo có nhiều folders)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
6. **Environment Variables:**
   - Thêm tất cả biến từ `.env`:
     ```
     DATABASE_URL=...
     NEXTAUTH_SECRET=...
     NEXTAUTH_URL=https://your-app.vercel.app
     GEMINI_API_KEY=...
     ALPHA_VANTAGE_API_KEY=...
     ```
7. **Click "Deploy"**

### Bước 3: Lấy link truy cập

- Sau khi deploy xong, Vercel sẽ tạo link: `https://your-app-name.vercel.app`
- **Link này là public**, ai cũng có thể truy cập!

### Bước 4: Setup Custom Domain (Optional)

1. Vào Project Settings > Domains
2. Add domain: `yourdomain.com`
3. Follow instructions để setup DNS

---

## 🗄️ Option 2: Deploy Database (Quan trọng!)

### Nếu chưa có cloud database:

#### A. Neon (Free - Recommended)

1. **Truy cập:** https://neon.tech
2. **Tạo project mới**
3. **Copy connection string**
4. **Update trong Vercel Environment Variables:**
   ```
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```

#### B. Supabase (Free)

1. **Truy cập:** https://supabase.com
2. **Tạo project mới**
3. **Settings > Database > Connection string**
4. **Update trong Vercel**

### Sau khi có cloud database:

```bash
# Run migrations trên production database
npx prisma migrate deploy

# Hoặc push schema
npx prisma db push
```

---

## 🔧 Option 3: Railway (Alternative)

1. **Truy cập:** https://railway.app
2. **New Project > Deploy from GitHub**
3. **Add PostgreSQL** (database)
4. **Setup environment variables**
5. **Deploy**

**Link:** `https://your-app.up.railway.app`

---

## 🌐 Option 4: Netlify

1. **Truy cập:** https://netlify.com
2. **Add new site > Import from Git**
3. **Build settings:**
   - Build command: `cd Web/hawkeye-platform && npm run build`
   - Publish directory: `Web/hawkeye-platform/.next`
4. **Environment variables**
5. **Deploy**

**Link:** `https://your-app.netlify.app`

---

## 📝 Checklist trước khi deploy

### ✅ Code
- [ ] Code đã commit và push lên Git
- [ ] Không có lỗi khi chạy `npm run build`
- [ ] Test local: `npm run dev` hoạt động tốt

### ✅ Environment Variables
- [ ] `DATABASE_URL` - Cloud database connection string
- [ ] `NEXTAUTH_SECRET` - Generate mới cho production
- [ ] `NEXTAUTH_URL` - URL của website sau khi deploy
- [ ] `GEMINI_API_KEY` hoặc `OPENAI_API_KEY`
- [ ] `ALPHA_VANTAGE_API_KEY` (nếu dùng)

### ✅ Database
- [ ] Database đã được tạo trên cloud
- [ ] Schema đã được push: `npx prisma db push`
- [ ] Seed data (optional): `npm run db:seed`

### ✅ Security
- [ ] `.env` không được commit vào Git
- [ ] API keys không hardcode trong code
- [ ] CORS settings đúng

---

## 🚀 Quick Deploy với Vercel CLI

### Cài đặt Vercel CLI:

```bash
npm i -g vercel
```

### Deploy:

```bash
cd Web/hawkeye-platform
vercel
```

Follow prompts:
- Link to existing project? **No** (lần đầu)
- Project name: **hawkeye-platform**
- Directory: **./**
- Override settings? **No**

### Deploy production:

```bash
vercel --prod
```

---

## 🔗 Share link với người khác

Sau khi deploy xong, bạn sẽ có link dạng:
- Vercel: `https://hawkeye-platform.vercel.app`
- Railway: `https://hawkeye-platform.up.railway.app`
- Netlify: `https://hawkeye-platform.netlify.app`

**Chia sẻ link này với bất kỳ ai!**

---

## 🛠️ Troubleshooting

### Build fails

```bash
# Test build local trước
npm run build

# Check errors
npm run lint
```

### Database connection error

- ✅ Kiểm tra `DATABASE_URL` trong Vercel
- ✅ Đảm bảo database cho phép connections từ Vercel IPs
- ✅ Check SSL mode: `?sslmode=require`

### Environment variables không work

- ✅ Restart deployment sau khi thêm env vars
- ✅ Check variable names (case-sensitive)
- ✅ Verify values không có spaces

### 404 errors

- ✅ Check `NEXTAUTH_URL` đúng với domain
- ✅ Verify routing trong Next.js
- ✅ Check build logs

---

## 📊 Monitor & Analytics

### Vercel Analytics (Free):

1. Vào Project Settings
2. Enable Analytics
3. Xem traffic, performance metrics

### Custom Analytics:

- Google Analytics
- Plausible
- Umami

---

## 🔄 Continuous Deployment

Sau khi setup xong, mỗi lần push code lên Git:
- Vercel tự động deploy
- Preview deployments cho mỗi PR
- Production deployment cho main branch

---

## 💡 Tips

1. **Start với Vercel** - dễ nhất cho Next.js
2. **Dùng Neon cho database** - free tier tốt
3. **Test local trước** - `npm run build` phải pass
4. **Monitor logs** - Vercel có logs real-time
5. **Use preview deployments** - test trước khi merge

---

## 🎯 Recommended Setup

```
GitHub (code)
    ↓
Vercel (hosting) ← Free, auto-deploy
    ↓
Neon (database) ← Free PostgreSQL
    ↓
Your Domain (optional) ← Custom domain
```

---

## 📞 Need Help?

1. **Vercel Docs:** https://vercel.com/docs
2. **Next.js Deploy:** https://nextjs.org/docs/deployment
3. **Prisma Deploy:** https://www.prisma.io/docs/guides/deployment

---

## ✅ Quick Start (5 phút)

```bash
# 1. Push code lên GitHub
git push origin main

# 2. Vào vercel.com
# 3. Import project
# 4. Add environment variables
# 5. Deploy
# 6. Share link! 🎉
```

**Sau 5 phút, bạn sẽ có link public để share!**

