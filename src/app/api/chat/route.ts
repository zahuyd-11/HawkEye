import { NextResponse } from "next/server";
import { hpgMockData } from "@/data/mock-hpg-data";
import { calculateValuation } from "@/lib/valuation-logic";
import { macroStats, impactNews } from "@/data/mock-macro-data";

/**
 * Build context-aware system prompt with real-time data
 */
function buildSystemPrompt(): string {
  // Calculate HPG valuation
  const valuation = calculateValuation(hpgMockData);

  // Get macro context
  const vnIndex = macroStats.find((s) => s.id === "vnindex");
  const usdRate = macroStats.find((s) => s.id === "usd");
  const topNews = impactNews.slice(0, 3);

  // Mock user profile (Balanced Investor)
  const userProfile = {
    name: "Nhà đầu tư Cân Bằng",
    allocation: "50% Stocks, 30% Bonds, 20% Cash",
    stopLoss: "-7%",
    maxPosition: "20% NAV/cổ phiếu",
  };

  // Build context string
  const marketContext = `
1. **Market Context (from MicroResearch):**
   - VN-Index: ${vnIndex?.value.toFixed(1)} điểm (${vnIndex?.changePercent > 0 ? "+" : ""}${vnIndex?.changePercent.toFixed(2)}%)
   - USD/VND: ${usdRate?.value.toLocaleString()} VND (${usdRate?.changePercent > 0 ? "+" : ""}${usdRate?.changePercent.toFixed(2)}%)
   - Key News:
     ${topNews.map((n) => `- ${n.title} (${n.impact === "POSITIVE" ? "Tích cực" : n.impact === "NEGATIVE" ? "Tiêu cực" : "Trung lập"})`).join("\n     ")}`;

  const stockContext = `
2. **Stock Data (from DealDigest - HPG):**
   - Ticker: ${hpgMockData.ticker}
   - Current Price: ${hpgMockData.currentPrice.toLocaleString()} VND
   - Fair Value: ${valuation.compositeFairValue.toLocaleString()} VND
   - Upside: ${valuation.upsidePercentage > 0 ? "+" : ""}${valuation.upsidePercentage.toFixed(2)}%
   - Verdict: ${valuation.recommendation} (${valuation.verdict})
   - Key Catalyst: ${hpgMockData.catalysts[0]}`;

  const userContext = `
3. **User Profile (from TradePlan):**
   - Profile: ${userProfile.name}
   - Allocation Rule: ${userProfile.allocation}
   - Stoploss Rule: ${userProfile.stopLoss}
   - Max Position: ${userProfile.maxPosition}`;

  return `Bạn là HawkEye AI, một trợ lý tài chính chuyên nghiệp cho nhà đầu tư F0 Việt Nam.

Bạn có quyền truy cập vào dữ liệu thời gian thực sau:

${marketContext}

${stockContext}

${userContext}

**Quy tắc trả lời:**
- Luôn trả lời bằng **tiếng Việt**.
- **Dựa trên dữ liệu:** Sử dụng số liệu cụ thể từ context (giá, %, xu hướng).
- **Cá nhân hóa:** Khi người dùng hỏi "Có nên mua không?", tham chiếu đến profile "${userProfile.name}" của họ (ví dụ: "Vì bạn là ${userProfile.name}, HPG phù hợp với danh mục...")
- **Ngắn gọn:** Giữ câu trả lời dưới 150 từ.
- **Kết nối dữ liệu:** Kết hợp DealDigest + Macro + TradePlan khi có thể (ví dụ: "Dựa trên định giá, HPG đang Rẻ. Tuy nhiên, vì bạn là ${userProfile.name}, hãy đợi VN-Index ổn định quanh ${vnIndex?.value.toFixed(0)} trước khi giải ngân 30% vốn.")`;
}

/**
 * Generate mock response based on user message keywords
 */
function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // HPG Analysis
  if (lowerMessage.includes("hpg")) {
    const valuation = calculateValuation(hpgMockData);
    return `Hòa Phát (HPG) hiện tại giá ${hpgMockData.currentPrice.toLocaleString()} VND. Giá trị hợp lý: ${valuation.compositeFairValue.toLocaleString()} VND (Upside ${valuation.upsidePercentage > 0 ? "+" : ""}${valuation.upsidePercentage.toFixed(2)}%). Khuyến nghị: ${valuation.recommendation}. Vì bạn là Nhà đầu tư Cân Bằng, có thể phân bổ tối đa 20% NAV vào HPG với stop-loss -7%.`;
  }

  // VN-Index Commentary
  if (lowerMessage.includes("vn-index") || lowerMessage.includes("vnindex") || lowerMessage.includes("vni") || lowerMessage.includes("vĩ mô")) {
    const vnIndex = macroStats.find((s) => s.id === "vnindex");
    const usdRate = macroStats.find((s) => s.id === "usd");
    return `VN-Index hiện tại ${vnIndex?.value.toFixed(1)} điểm (${vnIndex?.changePercent > 0 ? "+" : ""}${vnIndex?.changePercent.toFixed(2)}%). Tỷ giá USD/VND: ${usdRate?.value.toLocaleString()} (${usdRate?.changePercent > 0 ? "+" : ""}${usdRate?.changePercent.toFixed(2)}%). Thị trường đang đi ngang quanh mốc ${vnIndex?.value.toFixed(0)} điểm. Vì bạn là Nhà đầu tư Cân Bằng, nên thận trọng giải ngân khi VN-Index ổn định.`;
  }

  // Strategy/Profile questions
  if (lowerMessage.includes("chiến lược") || lowerMessage.includes("profile") || lowerMessage.includes("của tôi")) {
    return `Dựa trên hồ sơ của bạn (Nhà đầu tư Cân Bằng), phân bổ tài sản khuyến nghị: 50% Cổ phiếu, 30% Trái phiếu/Tiết kiệm, 20% Tiền mặt. Quy tắc: Cắt lỗ linh hoạt -7% đến -10%, tối đa 20% NAV/cổ phiếu. Cổ phiếu trọng tâm: HPG, MBB, CTG, SSI, VND.`;
  }

  // Default response
  return `Chào bạn, tôi là HawkEye AI. Tôi có thể giúp bạn phân tích HPG, xu hướng vĩ mô, hoặc chiến lược đầu tư cá nhân hóa. Bạn muốn hỏi gì?`;
}

export async function POST(request: Request) {
  // Parse request body first (can only be read once)
  let userMessage = "";
  try {
    const body = await request.json();
    userMessage = body?.message || "";
  } catch (parseError) {
    // If we can't parse the request, return default mock
    console.error("Failed to parse request body:", parseError);
    const mockResponse = getMockResponse("");
    return NextResponse.json({
      response: mockResponse,
    });
  }

  if (!userMessage || typeof userMessage !== "string") {
    const mockResponse = getMockResponse("");
    return NextResponse.json({
      response: mockResponse,
    });
  }

  // Check for OpenAI API key
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // If no API key, return mock response immediately
  if (!openaiApiKey) {
    console.log("OpenAI API key not found, using mock response");
    const mockResponse = getMockResponse(userMessage);
    return NextResponse.json({
      response: mockResponse,
    });
  }

  // Attempt to call OpenAI API with robust error handling
  let aiResponse: string | null = null;
  let openaiError: any = null;

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(),
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (openaiResponse.ok) {
      const data = await openaiResponse.json();
      aiResponse = data.choices?.[0]?.message?.content || null;
    } else {
      // Log the error for debugging
      const errorData = await openaiResponse.json().catch(() => ({}));
      openaiError = {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        error: errorData,
      };
      console.error("OpenAI API error:", {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        error: errorData,
      });
    }
  } catch (fetchError: any) {
    // Network error or other fetch issues
    openaiError = {
      type: "fetch_error",
      message: fetchError.message,
      stack: fetchError.stack,
    };
    console.error("OpenAI API fetch error:", fetchError);
  }

  // If we got a successful AI response, return it
  if (aiResponse) {
    return NextResponse.json({
      response: aiResponse,
    });
  }

  // If OpenAI failed, fall back to mock response
  // Log the error but don't return 500 to user
  if (openaiError) {
    console.error("OpenAI API failed, using fallback mock response. Error details:", JSON.stringify(openaiError, null, 2));
  }

  // Always return mock response if OpenAI fails (never return 500)
  const mockResponse = getMockResponse(userMessage);
  return NextResponse.json({
    response: mockResponse,
  });
}

