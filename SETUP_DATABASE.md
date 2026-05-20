# 🗄️ Hướng dẫn Setup Database

## Bước 1: Tạo Database

### Option 1: PostgreSQL Local (Recommended cho development)

1. **Cài đặt PostgreSQL:**
   - Windows: Download từ https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Tạo database:**
   ```bash
   # Login vào PostgreSQL
   psql -U postgres

   # Tạo database
   CREATE DATABASE hawkeye;

   # Tạo user (optional)
   CREATE USER hawkeye_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hawkeye TO hawkeye_user;
   ```

### Option 2: Neon (Free PostgreSQL Cloud - Recommended)

1. Truy cập https://neon.tech
2. Đăng ký tài khoản miễn phí
3. Tạo project mới
4. Copy connection string vào `.env`

### Option 3: Supabase (Free PostgreSQL Cloud)

1. Truy cập https://supabase.com
2. Đăng ký tài khoản miễn phí
3. Tạo project mới
4. Vào Settings > Database > Connection string
5. Copy connection string vào `.env`

## Bước 2: Setup Environment Variables

1. **Copy file .env.example:**
   ```bash
   cd Web/hawkeye-platform
   cp .env.example .env
   ```

2. **Cập nhật DATABASE_URL trong .env:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hawkeye?schema=public"
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   # Windows PowerShell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))

   # Mac/Linux
   openssl rand -base64 32
   ```

## Bước 3: Chạy Migrations

```bash
cd Web/hawkeye-platform

# Generate Prisma Client
npm run db:generate

# Push schema to database (tạo tables)
npm run db:push

# Hoặc nếu muốn dùng migrations (recommended cho production)
npx prisma migrate dev --name init
```

## Bước 4: Seed Data (Optional)

Tạo file `prisma/seed.ts` để thêm dữ liệu mẫu:

```bash
npm run db:seed
```

## Bước 5: Verify Database

```bash
# Mở Prisma Studio để xem database
npm run db:studio
```

## Troubleshooting

### Lỗi: "Can't reach database server"
- Kiểm tra PostgreSQL đang chạy: `pg_isready`
- Kiểm tra connection string trong `.env`
- Kiểm tra firewall settings

### Lỗi: "Schema does not exist"
- Đảm bảo connection string có `?schema=public`
- Hoặc tạo schema: `CREATE SCHEMA IF NOT EXISTS public;`

### Lỗi: "Permission denied"
- Kiểm tra user có quyền truy cập database
- Hoặc dùng superuser (postgres) cho development

## Next Steps

Sau khi setup database xong:
1. ✅ Database đã sẵn sàng
2. Chạy `npm run dev` để start server
3. Đăng ký tài khoản tại `/auth/signup`
4. Đăng nhập tại `/auth/signin`

