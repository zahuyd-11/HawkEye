import { requireApiSession } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RETAIL_LEGAL_DISCLAIMER } from "@/lib/compliance/disclaimer";
import { getOpenClawContextBundle } from "@/data/openclaw-snapshot";
import { getCompanySnapshot } from "@/data/market-snapshot";

export interface ProblemSolvingResponse {
  situationSummary: string;
  emotionalAssessment: string;
  remediationChecklist: string[];
  tacticalNotes: string;
  disclaimer: string;
}

function extractTicker(text: string): string {
  const m = text.match(/\b(HPG|FPT|DGW|VCB|MWG|VHM|SSI|VIC)\b/i);
  return m ? m[1].toUpperCase() : "HPG";
}

function buildFallback(distress: string, bias?: string): ProblemSolvingResponse {
  const ticker = extractTicker(distress);
  const snap = getCompanySnapshot(ticker);
  const isPanic = bias === "panic";

  return {
    situationSummary: `Vị thế ${ticker} đang chịu áp lực. Giá tham chiếu ${snap.currentPrice.toLocaleString("vi-VN")} VND — cần tái cân bằng danh mục, không đuổi giá cảm xúc.`,
    emotionalAssessment: isPanic
      ? "Loss Aversion cao — tránh bán tháo toàn bộ trong một phiên."
      : "Giữ kỷ luật — tách quyết định khỏi tin đồn ngắn hạn.",
    remediationChecklist: [
      "Giảm tỷ trọng mã lõi xuống dưới 25% NAV trong 3 phiên",
      "Triển khai 30% cash buffer chờ xác nhận xu hướng trên MA20",
      "Kích hoạt Deal Digest kiểm toán BCTC trước khi bổ sung vốn",
      isPanic ? "Đặt stop-loss kỷ luật theo ngưỡng drawdown đã khai báo" : "Giữ vị thế cốt lõi nếu FCF quality ổn định",
    ],
    tacticalNotes: "Ưu tiên Sector Rebalancing và lịch cắt lỗ có kế hoạch thay vì all-in trung bình giá.",
    disclaimer: RETAIL_LEGAL_DISCLAIMER,
  };
}

function parseResponse(raw: string): ProblemSolvingResponse | null {
  try {
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const p = JSON.parse(clean);
    if (!p.situationSummary || !Array.isArray(p.remediationChecklist)) return null;
    return {
      situationSummary: p.situationSummary,
      emotionalAssessment: p.emotionalAssessment || "",
      remediationChecklist: p.remediationChecklist,
      tacticalNotes: p.tacticalNotes || "",
      disclaimer: RETAIL_LEGAL_DISCLAIMER,
    };
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireApiSession();
    if (authError) return authError;

    const body = await request.json();
    const distressNarrative = String(body.distressNarrative ?? body.message ?? "").trim();
    if (!distressNarrative) {
      return NextResponse.json({ error: "distressNarrative is required" }, { status: 400 });
    }

    const behavioralBias = String(body.behavioralBias ?? "");
    const openClaw = getOpenClawContextBundle([extractTicker(distressNarrative)]);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        mode: "fallback",
        ...buildFallback(distressNarrative, behavioralBias),
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are HawkEye Portfolio Rescue Engine (CFA problem-solving + behavioral finance).
User distressed position narrative: """${distressNarrative}"""
Known behavioral bias: ${behavioralBias || "unknown"}

${openClaw}

Assess emotional matrix (Loss Aversion / Overconfidence). Return tactical remediation ONLY as JSON:
{
  "situationSummary": "Vietnamese",
  "emotionalAssessment": "Vietnamese",
  "remediationChecklist": ["step 1", "step 2", "step 3", "step 4"],
  "tacticalNotes": "Vietnamese"
}
`.trim();

    const result = await model.generateContent(prompt);
    const parsed =
      parseResponse(result.response.text()) ?? buildFallback(distressNarrative, behavioralBias);

    return NextResponse.json({ success: true, mode: "gemini", ...parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Problem solving failed";
    console.error("Problem solving error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
