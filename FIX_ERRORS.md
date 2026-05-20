# 🔧 Fix Lỗi Next.js

## ❌ Lỗi: "Cannot find module './1682.js'"

Đây là lỗi do **cache bị corrupt**. Cách fix:

### ✅ Cách 1: Xóa cache và rebuild (Nhanh nhất)

```powershell
cd Web\hawkeye-platform

# Xóa .next folder
Remove-Item -Recurse -Force .next

# Xóa cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Restart dev server
npm run dev
```

### ✅ Cách 2: Clean install (Nếu cách 1 không work)

```powershell
# Xóa tất cả
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install

# Start lại
npm run dev
```

### ✅ Cách 3: Clear Next.js cache hoàn toàn

```powershell
# Xóa .next
Remove-Item -Recurse -Force .next

# Xóa node_modules cache
Remove-Item -Recurse -Force node_modules\.cache

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Start
npm run dev
```

---

## 🔍 Các lỗi thường gặp khác

### Lỗi: "Module not found"

```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Lỗi: "Port 3000 already in use"

```powershell
# Kill process trên port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc dùng port khác
npm run dev -- -p 3001
```

### Lỗi: TypeScript errors

```powershell
# Xóa .next và rebuild
Remove-Item -Recurse -Force .next
npm run build
```

### Lỗi: "ENOENT" hoặc file không tìm thấy

```powershell
# Check file paths
# Đảm bảo không có spaces trong paths
# Reinstall nếu cần
```

---

## 💡 Tips để tránh lỗi

1. **Luôn xóa .next khi có lỗi lạ:**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

2. **Restart dev server thường xuyên**

3. **Update dependencies:**
   ```powershell
   npm update
   ```

4. **Check Node.js version:**
   ```powershell
   node --version
   # Nên dùng Node 18+ hoặc 20+
   ```

---

## 🚀 Quick Fix Script

Tạo file `fix.ps1`:

```powershell
Write-Host "🔧 Fixing Next.js errors..." -ForegroundColor Yellow

Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

Write-Host "✅ Cache cleared!" -ForegroundColor Green
Write-Host "🚀 Starting dev server..." -ForegroundColor Cyan

npm run dev
```

Chạy: `.\fix.ps1`

---

## 📞 Nếu vẫn lỗi

1. Check Next.js version: `npm list next`
2. Update Next.js: `npm install next@latest`
3. Check Node.js version
4. Xem logs trong terminal để biết lỗi cụ thể

---

## ✅ Sau khi fix

Nếu fix thành công, bạn sẽ thấy:
```
✓ Ready in Xms
○ Compiling / ...
✓ Compiled / in XXXms
```

🎉 **Server đã chạy!**

