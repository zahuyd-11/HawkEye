# 🚀 Deploy lên Vercel - Hướng dẫn đơn giản

## ⚡ 3 Bước đơn giản

### Bước 1: Push code lên GitHub

```powershell
cd Web\hawkeye-platform

# Nếu chưa có git
git init
git add .
git commit -m "Ready for Vercel"

# Tạo repo trên GitHub.com trước, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/hawkeye-platform.git
git push -u origin main
```

### Bước 2: Deploy trên Vercel

1. Truy cập: **https://vercel.com/new**
2. Đăng nhập bằng GitHub
3. Click **"Import"** bên cạnh repository của bạn
4. **Environment Variables:**
   - `DATABASE_URL` (từ Neon/Supabase)
   - `NEXTAUTH_SECRET` (chạy: `npm run generate:secret`)
   - `NEXTAUTH_URL` (sẽ update sau)
5. Click **"Deploy"**

### Bước 3: Lấy link!

Sau 1-2 phút, bạn sẽ có:
- 🔗 **Link:** `https://your-app.vercel.app`
- ✅ **Share link này!**

---

## 🗄️ Setup Database (Nếu chưa có)

### Neon (Free):

1. https://neon.tech
2. Sign up → Create project
3. Copy connection string
4. Thêm vào Vercel Environment Variables

---

## ✅ Checklist

- [ ] Code trên GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] **SHARE LINK!** 🎉

---

## 🎯 Link của bạn:

```
https://hawkeye-platform-xxxxx.vercel.app
```

**Copy và share!** ✅

---

👉 **Bắt đầu:** https://vercel.com/new

