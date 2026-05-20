# 🚀 Hướng dẫn Deploy lên Vercel - Từng bước chi tiết

## 📋 Bước 1: Chuẩn bị code

### 1.1. Kiểm tra build thành công

Mở PowerShell trong thư mục `Web/hawkeye-platform`:

```powershell
cd Web\hawkeye-platform
npm run build
```

Nếu build thành công (không có lỗi), tiếp tục!

### 1.2. Khởi tạo Git (nếu chưa có)

```powershell
# Kiểm tra xem đã có git chưa
git status

# Nếu báo lỗi "not a git repository", chạy:
git init
git add .
git commit -m "Initial commit - Ready for Vercel"
```

---

## 📤 Bước 2: Push code lên GitHub

### 2.1. Tạo repository trên GitHub

1. Truy cập: **https://github.com/new**
2. Đặt tên: `hawkeye-platform` (hoặc tên bạn muốn)
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** tích "Initialize with README"
5. Click **"Create repository"**

### 2.2. Push code lên GitHub

GitHub sẽ hiển thị hướng dẫn. Chọn **"push an existing repository"** và chạy:

```powershell
# Thay YOUR_USERNAME bằng username GitHub của bạn
git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git
git branch -M main
git push -u origin main
```

**Lưu ý:** Nếu hỏi username/password, dùng **Personal Access Token** thay vì password.

---

## 🌐 Bước 3: Deploy lên Vercel

### 3.1. Truy cập Vercel

👉 **https://vercel.com/new**

### 3.2. Đăng nhập

- Click **"Continue with GitHub"**
- Authorize Vercel để truy cập repositories

### 3.3. Import Project

1. Bạn sẽ thấy danh sách repositories
2. Tìm và click **"Import"** bên cạnh `hawkeye-platform`
3. Hoặc click **"Add New Project"** > chọn repository

### 3.4. Configure Project

Vercel sẽ tự động detect Next.js. Kiểm tra:

- **Framework Preset:** `Next.js` ✅
- **Root Directory:** 
  - Nếu repo chỉ có `hawkeye-platform` → để trống
  - Nếu repo có nhiều folders → nhập: `Web/hawkeye-platform`
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅

### 3.5. Environment Variables (QUAN TRỌNG!)

Click **"Environment Variables"** và thêm:

#### A. Database URL

```
Name: DATABASE_URL
Value: postgresql://user:password@host/database?sslmode=require
```

**Nếu chưa có database:**
- Truy cập: https://neon.tech (free)
- Tạo project mới
- Copy connection string
- Paste vào đây

#### B. NextAuth Secret

Trên máy local, chạy:

```powershell
npm run generate:secret
```

Copy output và thêm:

```
Name: NEXTAUTH_SECRET
Value: (paste secret vừa generate)
```

#### C. NextAuth URL

```
Name: NEXTAUTH_URL
Value: https://hawkeye-platform.vercel.app
```

*(Sẽ update sau khi có link thực tế)*

#### D. API Keys (nếu có)

```
Name: GEMINI_API_KEY
Value: (your key - optional)

Name: ALPHA_VANTAGE_API_KEY
Value: (your key - optional)
```

### 3.6. Deploy!

1. Click nút **"Deploy"** (màu xanh)
2. Đợi 1-2 phút...
3. ✅ **Deployment successful!**

---

## 🎉 Bước 4: Lấy link!

Sau khi deploy xong, bạn sẽ thấy:

- ✅ **"Congratulations! Your project has been deployed"**
- 🔗 **Link:** `https://hawkeye-platform-xxxxx.vercel.app`

**Đây là link PUBLIC - share với ai cũng được!** 🎊

---

## 🔄 Bước 5: Update NEXTAUTH_URL

Sau khi có link thực tế:

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. **Settings** > **Environment Variables**
4. Tìm `NEXTAUTH_URL`
5. Click **Edit**
6. Update value = link mới (ví dụ: `https://hawkeye-platform-xxxxx.vercel.app`)
7. **Save**
8. Vercel sẽ tự động redeploy

---

## 🗄️ Bước 6: Setup Database (Nếu chưa có)

### Option A: Neon (Free - Recommended)

1. Truy cập: **https://neon.tech**
2. Sign up (free)
3. **Create project**
4. Chọn region gần nhất
5. **Create**
6. Copy **Connection string**
7. Vào Vercel > **Settings** > **Environment Variables**
8. Update `DATABASE_URL`
9. **Redeploy**

### Option B: Supabase (Free)

1. Truy cập: **https://supabase.com**
2. Create new project
3. **Settings** > **Database** > **Connection string**
4. Copy và thêm vào Vercel

### Sau đó chạy migrations:

Trên máy local:

```powershell
cd Web\hawkeye-platform
npx prisma db push
```

Hoặc:

```powershell
npx prisma migrate deploy
```

---

## ✅ Checklist

- [ ] Code build thành công (`npm run build`)
- [ ] Code đã push lên GitHub
- [ ] Vercel project đã tạo
- [ ] Environment variables đã thêm
- [ ] Deploy thành công
- [ ] Link hoạt động
- [ ] Database đã setup (nếu cần)
- [ ] NEXTAUTH_URL đã update
- [ ] **SHARE LINK!** 🎉

---

## 🎯 Link của bạn sẽ là:

```
https://hawkeye-platform-xxxxx.vercel.app
```

hoặc nếu bạn đặt tên khác:

```
https://your-project-name.vercel.app
```

**Copy link này và share!** ✅

---

## 🆘 Troubleshooting

### Build fails trên Vercel

**Kiểm tra local trước:**
```powershell
npm run build
```

**Common issues:**
- Missing dependencies → Check `package.json`
- TypeScript errors → Fix errors
- Environment variables missing → Add to Vercel

### Database connection error

- ✅ Check `DATABASE_URL` format đúng
- ✅ Đảm bảo database cho phép external connections
- ✅ Check SSL mode: `?sslmode=require`

### 404 errors

- ✅ Check `NEXTAUTH_URL` đúng với domain
- ✅ Verify routing trong Next.js
- ✅ Redeploy sau khi update env vars

### Authentication không work

- ✅ Check `NEXTAUTH_SECRET` đã set
- ✅ Check `NEXTAUTH_URL` đúng
- ✅ Redeploy sau khi update

---

## 💡 Pro Tips

### 1. Vercel CLI (Nhanh hơn)

```powershell
# Cài đặt
npm install -g vercel

# Deploy
cd Web\hawkeye-platform
vercel

# Deploy production
vercel --prod
```

### 2. Auto-deploy

Sau khi setup xong:
- Mỗi lần `git push` → Vercel tự động deploy
- Preview deployments cho mỗi PR
- Production deployment cho main branch

### 3. Custom Domain

1. Vào **Settings** > **Domains**
2. Add domain của bạn
3. Follow instructions để setup DNS

### 4. Monitor Deployments

- Vào **Deployments** tab để xem logs
- Check build logs nếu có lỗi
- View function logs để debug

---

## 📊 Sau khi deploy

### Xem Analytics:

1. Vào **Analytics** tab
2. Xem traffic, performance
3. Monitor errors

### Update Code:

```powershell
# Make changes
git add .
git commit -m "Update features"
git push origin main

# Vercel tự động deploy! 🚀
```

---

## 🎊 Hoàn thành!

Bây giờ bạn đã có:
- ✅ Link public: `https://your-app.vercel.app`
- ✅ Auto-deploy từ GitHub
- ✅ Production-ready website
- ✅ Free hosting (Vercel free tier)

**Share link và enjoy!** 🎉

---

## 📞 Cần giúp?

1. **Vercel Docs:** https://vercel.com/docs
2. **Next.js Deploy:** https://nextjs.org/docs/deployment
3. **Check build logs** trong Vercel Dashboard

---

## 🚀 BẮT ĐẦU NGAY!

👉 **https://vercel.com/new**

**Chỉ cần 5-10 phút là có link public!** ⚡

