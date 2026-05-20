# ⚡ Quick Deploy to Vercel

## Bạn đang có GitHub Project: https://github.com/users/zahuyd-11/projects/1/views/1

## 🚀 3 Bước Deploy Nhanh

### Bước 1: Đảm bảo code đã push lên GitHub

```powershell
cd Web\hawkeye-platform
git status
git add .
git commit -m "Ready for Vercel"
git push
```

### Bước 2: Deploy trên Vercel

1. **Truy cập:** https://vercel.com/new
2. **Import** repository từ GitHub project của bạn
3. **Thêm Environment Variables:**
   - `DATABASE_URL` (từ Neon/Supabase/Railway)
   - `NEXTAUTH_SECRET` (generate bằng PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`)
   - `NEXTAUTH_URL` (sẽ update sau khi deploy xong)
4. **Click Deploy!**

### Bước 3: Sau khi deploy

1. Copy URL Vercel (ví dụ: `https://your-app.vercel.app`)
2. Update `NEXTAUTH_URL` trong Vercel Settings → Environment Variables
3. Chạy database migrations:
   ```powershell
   npx prisma db push
   ```

---

## ⚠️ Lưu ý về Build Error

Nếu Vercel báo lỗi build về `market-data/route.ts`:

**Giải pháp nhanh:** Vercel có thể vẫn build thành công. Nếu không:

1. Vào Vercel Dashboard → Settings → Build & Development Settings
2. Đổi Build Command thành: `prisma generate && SKIP_ENV_VALIDATION=true next build`

Hoặc tạm thời disable route đó trong code.

---

## ✅ Checklist

- [ ] Code đã push lên GitHub
- [ ] Database đã tạo (Neon/Supabase/Railway)
- [ ] Environment variables đã thêm vào Vercel
- [ ] Deploy thành công
- [ ] Database migrations đã chạy
- [ ] Website hoạt động!

---

**🎉 Xong! Website của bạn sẽ live tại:** `https://your-app.vercel.app`
