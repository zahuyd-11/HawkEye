# 🚀 Cách Chạy Web

## ⚡ Cách nhanh nhất:

### Windows (PowerShell):
```powershell
cd Web\hawkeye-platform
.\start.ps1
```

### Windows (CMD):
```cmd
cd Web\hawkeye-platform
start.bat
```

### Hoặc chạy trực tiếp:
```powershell
cd Web\hawkeye-platform
npm run dev
```

---

## 📋 Các lệnh khác:

### 1. Chạy Development Server:
```powershell
npm run dev
```
**Link:** http://localhost:3000

### 2. Build Production:
```powershell
npm run build
npm run start
```

### 3. Xem Database:
```powershell
npm run db:studio
```
**Link:** http://localhost:5555

### 4. Generate Prisma Client:
```powershell
npm run db:generate
```

### 5. Push Database Schema:
```powershell
npm run db:push
```

---

## 🔧 Setup lần đầu:

### Bước 1: Install dependencies
```powershell
npm install
```

### Bước 2: Setup Database
1. Tạo file `.env` với `DATABASE_URL`
2. Chạy: `npm run db:push`
3. (Optional) Seed data: `npm run db:seed`

### Bước 3: Generate Prisma Client
```powershell
npm run db:generate
```

### Bước 4: Chạy web
```powershell
npm run dev
```

---

## 🌐 Truy cập:

- **Website:** http://localhost:3000
- **Database Studio:** http://localhost:5555 (nếu chạy `db:studio`)

---

## 🆘 Troubleshooting:

### Port 3000 đã được sử dụng:
```powershell
# Kill process trên port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc dùng port khác
npm run dev -- -p 3001
```

### Lỗi "Cannot find module":
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Lỗi Prisma:
```powershell
npm run db:generate
```

### Cache issues:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## ✅ Checklist:

- [ ] Dependencies installed (`npm install`)
- [ ] Database setup (`.env` file)
- [ ] Prisma Client generated (`npm run db:generate`)
- [ ] Dev server running (`npm run dev`)
- [ ] Website accessible (http://localhost:3000)

---

## 🎯 Quick Start:

```powershell
# 1. Vào thư mục
cd Web\hawkeye-platform

# 2. Install (nếu chưa)
npm install

# 3. Generate Prisma (nếu chưa)
npm run db:generate

# 4. Chạy web
npm run dev
```

**Xong! Mở http://localhost:3000** 🎉












