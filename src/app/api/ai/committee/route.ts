import { requireApiSession } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatDgcContextForPrompt, DGC_DGW_TEMPLATE } from "@/data/dgc-template";
import { generateCfaReportTemplate } from "@/lib/ai/pdf-template";
import { openClawEngine, HAWKEYE_ENGINE_LABEL } from "@/lib/openclaw/engine";
import { buildCfaRiskReport } from "@/lib/quant/cfa-risk-report";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireApiSession();
    if (authError) return authError;

    const body = await request.json();
    const cleanTicker = (body.ticker || "DGW").toUpperCase().trim();
    const wacc = body.waccInput ?? body.wacc ?? DGC_DGW_TEMPLATE.waccAssumption;
    const g = body.growthInput ?? body.terminalGrowth ?? DGC_DGW_TEMPLATE.terminalGrowthPct;

    const quantReport = buildCfaRiskReport(cleanTicker, { wacc, terminalGrowth: g });

    const apiKey = process.env.GEMINI_API_KEY;
    let executiveSummary = quantReport.executiveSummary;
    let segmentNotes = quantReport.segmentNotes;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-pro",
          generationConfig: { responseMimeType: "application/json" },
        });

        const dgcBlock =
          cleanTicker === "DGW" || cleanTicker === "DGC"
            ? formatDgcContextForPrompt(cleanTicker)
            : "";

        const narrativePrompt = `
You are ${HAWKEYE_ENGINE_LABEL}. Refine ONLY narrative text for ${cleanTicker}.
Use EXACT numbers from QUANT_BLOCK — never change DCF figures.

${openClawEngine.buildAiContextBlock(cleanTicker)}
${dgcBlock}

QUANT_BLOCK (immutable):
- Recommendation: ${quantReport.recommendation}
- Target: ${quantReport.targetPrice} VND | Current: ${quantReport.currentPrice} VND
- Upside: ${quantReport.upsidePct}%

JSON only:
{ "executiveSummary": "2-3 câu tiếng Việt", "segmentNotes": [{ "segment": "string", "revenueSharePct": number, "growthOutlook": "string" }] }
`.trim();

        const response = await model.generateContent(narrativePrompt);
        const clean = response.response
          .text()
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(clean) as {
          executiveSummary?: string;
          segmentNotes?: typeof segmentNotes;
        };
        if (parsed.executiveSummary) executiveSummary = parsed.executiveSummary;
        if (parsed.segmentNotes?.length) segmentNotes = parsed.segmentNotes;
      } catch (e) {
        console.warn("Committee narrative fallback to quant-only:", e);
      }
    }

    const htmlReportContent = generateCfaReportTemplate({
      ticker: quantReport.ticker,
      companyName: quantReport.companyName,
      currentPrice: quantReport.currentPrice,
      targetPrice: quantReport.targetPrice,
      convictionScore: quantReport.convictionScore,
      regime: "HawkEye Quant Regime",
      recommendation: quantReport.recommendation,
      executiveSummary,
      dupontAnalysis: quantReport.dupontAnalysis,
      dcfForecast: quantReport.dcfForecast,
      segmentNotes,
      actionChecklist: quantReport.actionChecklist,
    });

    return NextResponse.json({
      success: true,
      engine: HAWKEYE_ENGINE_LABEL,
      mode: apiKey ? "quant+ai-narrative" : "quant-only",
      ticker: cleanTicker,
      recommendation: quantReport.recommendation,
      targetPrice: quantReport.targetPrice,
      convictionScore: quantReport.convictionScore,
      upsidePct: quantReport.upsidePct,
      dcfForecast: quantReport.dcfForecast,
      report: quantReport,
      htmlReport: htmlReportContent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Committee analysis failed";
    console.error("AI committee error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
