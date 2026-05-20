# 🚀 Quick Start Guide - HawkEye Platform

## 📋 Tổng quan các vấn đề đã giải quyết

### ✅ 1. Setup Database & Authentication
### ✅ 2. Market Data Real-time Updates
### ✅ 3. Fix Layout Issues
### ✅ 4. AI Integration (Gemini/OpenAI)

---

## 🔧 Bước 1: Setup Database

### Option A: Neon (Recommended - Free)

1. Truy cập https://neon.tech và đăng ký
2. Tạo project mới
3. Copy connection string
4. Tạo file `.env` trong `Web/hawkeye-platform/`:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Option B: Local PostgreSQL

```bash
# Tạo database
createdb hawkeye

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hawkeye"
```

### Chạy migrations:

```bash
cd Web/hawkeye-platform
npm install
npm run db:generate
npm run db:push
npm run db:seed  # Optional: thêm dữ liệu mẫu
```

**Test database:**
```bash
npm run db:studio  # Mở Prisma Studio để xem database
```

---

## 📊 Bước 2: Setup Market Data API

### Option 1: Alpha Vantage (Free - 500 calls/day)

1. Đăng ký tại: https://www.alphavantage.co/support/#api-key
2. Thêm vào `.env`:
```env
ALPHA_VANTAGE_API_KEY="your-api-key"
```

### Option 2: TradingEconomics (Paid)

1. Đăng ký tại: https://tradingeconomics.com/api
2. Thêm vào `.env`:
```env
TRADING_ECONOMICS_API_KEY="your-api-key"
```

### Option 3: Sử dụng Mock Data (Development)

Không cần API key, hệ thống sẽ dùng mock data.

**Market ticker tự động cập nhật mỗi 30 giây!**

---

## 🤖 Bước 3: Setup AI (Gemini hoặc OpenAI)

### Option 1: Google Gemini (Free tier available)

1. Lấy API key tại: https://makersuite.google.com/app/apikey
2. Thêm vào `.env`:
```env
GEMINI_API_KEY="your-api-key"
```

### Option 2: OpenAI ChatGPT

1. Lấy API key tại: https://platform.openai.com/api-keys
2. Thêm vào `.env`:
```env
OPENAI_API_KEY="your-api-key"
```

**Lưu ý:** Hệ thống sẽ ưu tiên Gemini nếu có, nếu không sẽ dùng OpenAI.

---

## 🎨 Bước 4: Fix Layout Issues

Đã fix các vấn đề:
- ✅ Body overflow
- ✅ Container width
- ✅ Box-sizing issues
- ✅ Horizontal scroll

Nếu vẫn còn lệch, kiểm tra:
1. Browser DevTools > Elements > kiểm tra margin/padding
2. Kiểm tra các component có `width: 100vw` không
3. Clear cache và reload

---

## 🏃 Bước 5: Chạy Application

```bash
cd Web/hawkeye-platform
npm run dev
```

Mở browser: http://localhost:3000

### Test Authentication:

1. Đăng ký: http://localhost:3000/auth/signup
2. Đăng nhập: http://localhost:3000/auth/signin
3. Dashboard: http://localhost:3000/dashboard

---

## 📝 API Endpoints

### Market Data (Real-time)
```
GET /api/market-data
```
- Cập nhật mỗi 30 giây
- Cache 60 giây

### AI Personalization
```
POST /api/ai/personalize
Body: {
  "content": "Original content...",
  "contentType": "deal-digest" | "micro-research" | "trade-plan"
}
```

---

## 🔍 Troubleshooting

### Database Connection Error
```bash
# Kiểm tra connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Market Data không cập nhật
- Kiểm tra API key trong `.env`
- Kiểm tra network tab trong DevTools
- Xem console logs

### AI không hoạt động
- Kiểm tra API key (GEMINI_API_KEY hoặc OPENAI_API_KEY)
- Kiểm tra quota/credits
- Xem server logs

### Layout vẫn lệch
- Hard refresh: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
- Clear browser cache
- Kiểm tra CSS conflicts

---

## 📚 Files quan trọng

- `SETUP_DATABASE.md` - Chi tiết setup database
- `OPTIMIZATION_GUIDE.md` - Hướng dẫn tối ưu
- `.env.example` - Template environment variables
- `prisma/schema.prisma` - Database schema
- `src/lib/ai.ts` - AI service
- `src/app/api/market-data/route.ts` - Market data API

---

## 🎯 Next Steps

1. ✅ Database setup
2. ✅ Market data real-time
3. ✅ AI integration
4. ⏳ Customize AI prompts
5. ⏳ Add more market data sources
6. ⏳ Implement user preferences for AI

---

## 💡 Tips

- Sử dụng `npm run db:studio` để quản lý database dễ dàng
- Market data tự động retry nếu API fail
- AI service có fallback nếu không có API key
- Tất cả API routes đều có error handling

---

## 🆘 Cần giúp đỡ?

1. Kiểm tra logs: `npm run dev` sẽ hiển thị errors
2. Database: `npm run db:studio` để xem data
3. API: Kiểm tra Network tab trong DevTools
4. Xem chi tiết trong các file `.md`

