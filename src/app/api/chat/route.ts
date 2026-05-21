import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { hpgMockData } from "@/data/mock-hpg-data";
import { calculateValuation } from "@/lib/valuation-logic";
import { macroStats, impactNews } from "@/data/mock-macro-data";

export interface CompanionResponse {
  replyText: string;
  thesis: string;
  catalysts: string;
  risks: string;
  confidence: number;
}

function buildMarketContext(): string {
  const valuation = calculateValuation(hpgMockData);
  const vnIndex = macroStats.find((s) => s.id === "vnindex");
  const usdRate = macroStats.find((s) => s.id === "usd");
  const topNews = impactNews.slice(0, 3);

  return `
VN-Index: ${vnIndex?.value.toFixed(1)} (${vnIndex?.changePercent > 0 ? "+" : ""}${vnIndex?.changePercent?.toFixed(2)}%)
USD/VND: ${usdRate?.value.toLocaleString()} VND
HPG: ${hpgMockData.currentPrice.toLocaleString()} VND | Fair Value ${valuation.compositeFairValue.toLocaleString()} | ${valuation.recommendation}
Tin tức: ${topNews.map((n) => n.title).join("; ")}
`.trim();
}

function getMockCompanion(message: string): CompanionResponse {
  const lower = message.toLowerCase();
  const valuation = calculateValuation(hpgMockData);

  if (lower.includes("hpg")) {
    return {
      replyText:
        "Chào bạn! Mình đã quét nhanh HPG — dưới đây là 3 khối luận điểm để bạn đọc trong 30 giây nhé.",
      thesis: `HPG đang giao dịch ${valuation.upsidePercentage > 0 ? "dưới" : "trên"} giá trị nội tại. Luận điểm: tận dụng chu kỳ thép khi biên lợi nhuận phục hồi.`,
      catalysts: "Xuất khẩu thép tăng; giá nguyên liệu ổn định; tỷ lệ nợ/vốn chủ cải thiện.",
      risks: "Biến động than cốc; áp lực USD/VND; P/E có thể vượt trung vị ngành.",
      confidence: Math.min(95, Math.max(40, 60 + Math.round(valuation.upsidePercentage))),
    };
  }

  if (lower.includes("vĩ mô") || lower.includes("vnindex") || lower.includes("vn-index")) {
    const vnIndex = macroStats.find((s) => s.id === "vnindex");
    return {
      replyText: `Thị trường đang ở vùng ${vnIndex?.value.toFixed(0)} điểm — mình tóm tắt bối cảnh Risk-On có kiểm soát cho bạn.`,
      thesis: `VN-Index quanh ${vnIndex?.value.toFixed(0)} điểm. Regime: Risk-On có kiểm soát — phù hợp tích lũy từng phần.`,
      catalysts: "Thanh khoản mở rộng; nhóm ngân hàng dẫn dắt; dòng ngoại net mua nhẹ.",
      risks: "Biến động tỷ giá; chính sách tiền tệ thắt chặt đột ngột.",
      confidence: 68,
    };
  }

  return {
    replyText:
      "Xin chào! Mình là HawkEye — người đồng hành AI cho hành trình đầu tư của bạn. Hỏi mã cổ phiếu (HPG, FPT, DGW) hoặc chủ đề vĩ mô nhé!",
    thesis: "HawkEye giúp nhà đầu tư cá nhân (F0) đọc luận điểm rõ ràng: Thesis → Catalysts → Risks.",
    catalysts: "Thử nhập mã cổ phiếu, hỏi về thị trường, hoặc mở Trade Plan để xem phân bổ vốn.",
    risks: "Đây là thông tin giáo dục, không phải khuyến nghị mua bán — luôn tự kiểm tra trước khi quyết định.",
    confidence: 50,
  };
}

function parseCompanionFromText(raw: string): CompanionResponse | null {
  try {
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (
      typeof parsed.thesis === "string" &&
      typeof parsed.catalysts === "string" &&
      typeof parsed.risks === "string" &&
      typeof parsed.confidence === "number"
    ) {
      return {
        replyText:
          typeof parsed.replyText === "string"
            ? parsed.replyText
            : "Đây là phân tích nhanh cho bạn — xem 3 khối bên dưới nhé!",
        thesis: parsed.thesis,
        catalysts: parsed.catalysts,
        risks: parsed.risks,
        confidence: Math.min(100, Math.max(1, Math.round(parsed.confidence))),
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access blocked" }, { status: 401 });
  }

  let userMessage = "";
  try {
    const body = await request.json();
    userMessage = (body?.message || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!userMessage) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const marketContext = buildMarketContext();

  if (!apiKey) {
    const data = getMockCompanion(userMessage);
    return NextResponse.json({ ...data, mode: "mock" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are a friendly, trusted personal financial advisor for everyday retail investors in Vietnam (F0, ages 16–40).
Speak in warm, everyday Vietnamese — no jargon walls. You are HawkEye AI Wealth Companion.

User question: "${userMessage}"

Live market context:
${marketContext}

Respond ONLY with valid JSON (no markdown wrappers):
{
  "replyText": "Thân thiện chào user và tóm tắt ngắn gọn trong 1-2 câu",
  "thesis": "Luận điểm đầu tư cốt lõi bằng tiếng Việt, tối đa 80 từ",
  "catalysts": "Yếu tố thúc đẩy tăng trưởng, tối đa 60 từ",
  "risks": "Rủi ro cần lưu ý ngắn gọn, tối đa 60 từ",
  "confidence": number from 1 to 100
}
`.trim();

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const data = parseCompanionFromText(rawText) ?? getMockCompanion(userMessage);

    return NextResponse.json({ ...data, mode: "gemini" });
  } catch (error: unknown) {
    console.error("Chat companion error:", error);
    const data = getMockCompanion(userMessage);
    return NextResponse.json({ ...data, mode: "fallback" });
  }
}
