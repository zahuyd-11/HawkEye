# 🔑 Hướng dẫn lấy API Keys

## 📊 Market Data APIs

### 1. Alpha Vantage (Free - Recommended cho development)

**Link:** https://www.alphavantage.co/support/#api-key

**Cách lấy:**
1. Truy cập https://www.alphavantage.co/support/#api-key
2. Điền email và click "GET FREE API KEY"
3. Check email và copy API key
4. Thêm vào `.env`:
   ```env
   ALPHA_VANTAGE_API_KEY="your-key-here"
   ```

**Limits:**
- Free tier: 5 calls/minute, 500 calls/day
- Đủ cho development và testing

**Sử dụng:**
- Hỗ trợ nhiều markets (US, Europe, Asia)
- Có thể query VNIndex nếu có symbol

---

### 2. TradingEconomics (Paid - Professional)

**Link:** https://tradingeconomics.com/api

**Cách lấy:**
1. Truy cập https://tradingeconomics.com/api
2. Đăng ký tài khoản
3. Subscribe plan (có free trial)
4. Lấy API key từ dashboard
5. Thêm vào `.env`:
   ```env
   TRADING_ECONOMICS_API_KEY="your-key-here"
   ```

**Features:**
- Real-time data
- Historical data
- Economic indicators
- Market indices

---

### 3. Fiin Group (Vietnam Market - Paid)

**Link:** https://fiin.vn

**Cách lấy:**
1. Liên hệ Fiin Group
2. Subscribe service
3. Lấy API credentials
4. Thêm vào `.env`:
   ```env
   FIIN_API_KEY="your-key-here"
   ```

**Features:**
- Vietnam stock market data
- Company financials
- Market indices (VNIndex, HNX, UPCOM)

---

## 🤖 AI APIs

### 1. Google Gemini (Free tier available - Recommended)

**Link:** https://makersuite.google.com/app/apikey

**Cách lấy:**
1. Truy cập https://makersuite.google.com/app/apikey
2. Đăng nhập với Google account
3. Click "Create API Key"
4. Copy API key
5. Thêm vào `.env`:
   ```env
   GEMINI_API_KEY="your-key-here"
   ```

**Limits:**
- Free tier: 60 requests/minute
- Đủ cho development

**Models:**
- `gemini-pro` - General purpose
- `gemini-pro-vision` - With image support

---

### 2. OpenAI ChatGPT (Paid)

**Link:** https://platform.openai.com/api-keys

**Cách lấy:**
1. Truy cập https://platform.openai.com/api-keys
2. Đăng nhập/Đăng ký
3. Click "Create new secret key"
4. Copy API key (chỉ hiện 1 lần!)
5. Thêm vào `.env`:
   ```env
   OPENAI_API_KEY="your-key-here"
   ```

**Pricing:**
- GPT-4: ~$0.03 per 1K tokens
- GPT-3.5-turbo: ~$0.002 per 1K tokens (rẻ hơn)

**Models:**
- `gpt-4` - Best quality, expensive
- `gpt-3.5-turbo` - Good quality, cheaper

---

## 🔐 Security Best Practices

### 1. Không commit API keys vào Git

```bash
# Đảm bảo .env trong .gitignore
echo ".env" >> .gitignore
```

### 2. Sử dụng Environment Variables

```env
# ✅ Đúng
GEMINI_API_KEY="your-key"

# ❌ Sai - không hardcode trong code
const apiKey = "your-key";
```

### 3. Rotate API keys định kỳ

- Đổi API keys mỗi 3-6 tháng
- Revoke keys cũ khi không dùng

### 4. Sử dụng different keys cho dev/prod

```env
# Development
GEMINI_API_KEY_DEV="dev-key"

# Production (trong Vercel/Netlify)
GEMINI_API_KEY="prod-key"
```

---

## 🧪 Test API Keys

### Test Market Data API:

```bash
# Test Alpha Vantage
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VNINDEX&apikey=YOUR_KEY"
```

### Test Gemini API:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Test OpenAI API:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 💡 Tips

1. **Start với free tiers** để test
2. **Monitor usage** để tránh overage
3. **Cache responses** để giảm API calls
4. **Use fallbacks** nếu API fail
5. **Rate limiting** để tránh abuse

---

## 📝 Example .env file

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Market Data (chọn 1)
ALPHA_VANTAGE_API_KEY="..."
# TRADING_ECONOMICS_API_KEY="..."
# FIIN_API_KEY="..."

# AI (chọn 1 hoặc cả 2)
GEMINI_API_KEY="..."
# OPENAI_API_KEY="..."
```

---

## 🆘 Troubleshooting

### API key không hoạt động
- ✅ Kiểm tra key đúng format
- ✅ Kiểm tra quota/credits
- ✅ Kiểm tra IP whitelist (nếu có)
- ✅ Test với curl/Postman

### Rate limit errors
- ✅ Implement caching
- ✅ Reduce request frequency
- ✅ Upgrade plan nếu cần

### CORS errors
- ✅ API calls phải từ server-side (API routes)
- ✅ Không gọi trực tiếp từ client

