# 🚀 Deploy NGAY BÂY GIỜ - Có link trong 5 phút!

## ⚡ Bước 1: Kiểm tra code đã sẵn sàng

```bash
cd Web/hawkeye-platform

# Test build
npm run build

# Nếu build thành công, tiếp tục!
```

## 📤 Bước 2: Push code lên GitHub

### Nếu chưa có Git repo:

```bash
# Khởi tạo git
git init
git add .
git commit -m "Initial commit - Ready to deploy"

# Tạo repo mới trên GitHub.com
# Sau đó:
git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git
git branch -M main
git push -u origin main
```

### Nếu đã có repo:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 🌐 Bước 3: Deploy lên Vercel (3 phút)

### A. Truy cập Vercel:
👉 **https://vercel.com/new**

### B. Đăng nhập:
- Click "Continue with GitHub"
- Authorize Vercel

### C. Import Project:
1. Click "Import" bên cạnh repo của bạn
2. Hoặc click "Add New Project" > chọn repo

### D. Configure Project:
- **Framework Preset:** Next.js (auto-detect)
- **Root Directory:** `Web/hawkeye-platform` (nếu repo có nhiều folders)
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `.next` (auto)

### E. Environment Variables (QUAN TRỌNG!):

Click "Environment Variables" và thêm:

#### 1. Database:
```
Name: DATABASE_URL
Value: postgresql://user:pass@host/db?sslmode=require
```
*(Lấy từ Neon/Supabase - xem bước 4)*

#### 2. NextAuth Secret:
```bash
# Chạy trên local để generate:
npm run generate:secret
```
Copy output và thêm:
```
Name: NEXTAUTH_SECRET
Value: (paste secret vừa generate)
```

#### 3. NextAuth URL:
```
Name: NEXTAUTH_URL
Value: https://your-app-name.vercel.app
```
*(Sẽ update sau khi có link)*

#### 4. API Keys (nếu có):
```
Name: GEMINI_API_KEY
Value: (your key)

Name: ALPHA_VANTAGE_API_KEY
Value: (your key)
```

### F. Deploy:
Click **"Deploy"** button!

⏳ Đợi 1-2 phút...

## 🎉 Bước 4: Lấy link!

Sau khi deploy xong, bạn sẽ thấy:
- ✅ **Deployment successful!**
- 🔗 **Link:** `https://hawkeye-platform-xxxxx.vercel.app`

**Đây là link PUBLIC - share với ai cũng được!** 🎊

## 🗄️ Bước 5: Setup Database (Nếu chưa có)

### Option A: Neon (Free - 2 phút)

1. Truy cập: **https://neon.tech**
2. Sign up (free)
3. Create new project
4. Copy connection string
5. Vào Vercel > Project Settings > Environment Variables
6. Update `DATABASE_URL`
7. Redeploy

### Option B: Supabase (Free)

1. Truy cập: **https://supabase.com**
2. Create new project
3. Settings > Database > Connection string
4. Copy và thêm vào Vercel

### Sau đó chạy migrations:

```bash
# Trên local machine
cd Web/hawkeye-platform
npx prisma db push
```

## 🔄 Bước 6: Update NEXTAUTH_URL

Sau khi có link, update:

1. Vào Vercel Dashboard
2. Project Settings > Environment Variables
3. Update `NEXTAUTH_URL` = link mới
4. Redeploy (hoặc tự động)

## ✅ Checklist

- [ ] Code đã push lên GitHub
- [ ] Vercel project đã tạo
- [ ] Environment variables đã thêm
- [ ] Deploy thành công
- [ ] Link hoạt động
- [ ] Database đã setup
- [ ] **SHARE LINK!** 🎉

## 🎯 Link của bạn sẽ là:

```
https://hawkeye-platform-xxxxx.vercel.app
```

**Copy link này và share!** ✅

## 🆘 Nếu gặp lỗi:

### Build fails:
```bash
# Test local
npm run build
```

### Database error:
- Check `DATABASE_URL` đúng format
- Đảm bảo database cho phép external connections

### 404 errors:
- Check `NEXTAUTH_URL` đúng với domain
- Redeploy sau khi update env vars

## 💡 Pro Tips

1. **Vercel CLI** (nhanh hơn):
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Auto-deploy:** Mỗi lần `git push` → tự động deploy

3. **Preview deployments:** Mỗi PR có preview link riêng

4. **Custom domain:** Vào Settings > Domains để add domain của bạn

---

## 🚀 BẮT ĐẦU NGAY!

👉 **https://vercel.com/new**

**Chỉ cần 5 phút là có link public!** ⚡

