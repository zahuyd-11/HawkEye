# 🚀 Hướng dẫn Deploy lên Vercel - Tiếng Việt

## ⚡ Cách nhanh nhất (5-10 phút)

### Bước 1: Chuẩn bị code

```powershell
# Vào thư mục project
cd Web\hawkeye-platform

# Test build (quan trọng!)
npm run build
```

Nếu build thành công (không có lỗi đỏ), tiếp tục!

---

### Bước 2: Push code lên GitHub

#### 2.1. Tạo repository trên GitHub

1. Truy cập: **https://github.com/new**
2. Repository name: `hawkeye-platform`
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** tích "Add a README file"
5. Click **"Create repository"**

#### 2.2. Push code

Trong PowerShell:

```powershell
# Nếu chưa có git
git init
git add .
git commit -m "Initial commit"

# Thêm remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git
git branch -M main
git push -u origin main
```

**Lưu ý:** Nếu hỏi password, dùng **Personal Access Token** (không phải password GitHub).

---

### Bước 3: Deploy lên Vercel

#### 3.1. Truy cập Vercel

👉 **https://vercel.com/new**

#### 3.2. Đăng nhập

- Click **"Continue with GitHub"**
- Authorize Vercel

#### 3.3. Import Project

1. Tìm repository `hawkeye-platform`
2. Click **"Import"**

#### 3.4. Cấu hình

Vercel tự động detect Next.js. Kiểm tra:

- **Framework:** Next.js ✅
- **Root Directory:** 
  - Nếu repo chỉ có `hawkeye-platform` → để trống
  - Nếu repo có nhiều folders → nhập: `Web/hawkeye-platform`
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅

#### 3.5. Environment Variables (QUAN TRỌNG!)

Click **"Environment Variables"** và thêm:

##### A. Database

```
Name: DATABASE_URL
Value: postgresql://user:pass@host/db?sslmode=require
```

**Nếu chưa có database:**
- Vào: https://neon.tech (free)
- Tạo project → Copy connection string
- Paste vào đây

##### B. NextAuth Secret

Trên máy local:

```powershell
npm run generate:secret
```

Copy output và thêm:

```
Name: NEXTAUTH_SECRET
Value: (paste secret)
```

##### C. NextAuth URL

```
Name: NEXTAUTH_URL
Value: https://hawkeye-platform.vercel.app
```

*(Sẽ update sau khi có link thực tế)*

##### D. API Keys (Optional)

```
Name: GEMINI_API_KEY
Value: (nếu có)

Name: ALPHA_VANTAGE_API_KEY
Value: (nếu có)
```

#### 3.6. Deploy!

1. Click **"Deploy"** (nút xanh)
2. Đợi 1-2 phút...
3. ✅ **Xong!**

---

### Bước 4: Lấy link!

Sau khi deploy xong:

- ✅ **"Congratulations! Your project has been deployed"**
- 🔗 **Link:** `https://hawkeye-platform-xxxxx.vercel.app`

**Đây là link PUBLIC - share với ai cũng được!** 🎊

---

### Bước 5: Update NEXTAUTH_URL

1. Vào Vercel Dashboard
2. **Settings** > **Environment Variables**
3. Tìm `NEXTAUTH_URL`
4. Update = link mới
5. **Save** (tự động redeploy)

---

## 🗄️ Setup Database (Nếu chưa có)

### Neon (Free - 2 phút)

1. Truy cập: **https://neon.tech**
2. Sign up (free)
3. **Create project**
4. Copy **Connection string**
5. Vào Vercel > **Settings** > **Environment Variables**
6. Update `DATABASE_URL`
7. **Redeploy**

Sau đó chạy migrations:

```powershell
npx prisma db push
```

---

## ✅ Checklist

- [ ] Code build thành công
- [ ] Code đã push lên GitHub
- [ ] Vercel project đã tạo
- [ ] Environment variables đã thêm
- [ ] Deploy thành công
- [ ] Link hoạt động
- [ ] Database đã setup
- [ ] **SHARE LINK!** 🎉

---

## 🆘 Gặp lỗi?

### Build fails

```powershell
# Test local
npm run build
```

Fix lỗi trước khi deploy!

### Database error

- Check `DATABASE_URL` đúng format
- Đảm bảo database cho phép external connections

### 404 errors

- Check `NEXTAUTH_URL` đúng
- Redeploy sau khi update env vars

---

## 💡 Tips

1. **Auto-deploy:** Mỗi lần `git push` → tự động deploy
2. **Preview:** Mỗi PR có preview link riêng
3. **Custom domain:** Settings > Domains

---

## 🎯 Link của bạn:

```
https://hawkeye-platform-xxxxx.vercel.app
```

**Copy và share!** ✅

---

## 🚀 BẮT ĐẦU NGAY!

👉 **https://vercel.com/new**

**Chỉ cần 5-10 phút!** ⚡

