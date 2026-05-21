import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCompanySnapshot } from "@/data/market-snapshot";
import { formatDgcContextForPrompt, DGC_DGW_TEMPLATE } from "@/data/dgc-template";
import { generateCfaReportTemplate } from "@/lib/ai/pdf-template";

function parseModelJson(raw: string) {
  const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(clean);
}

function buildInstitutionalBaseline(ticker: string) {
  const c = getCompanySnapshot(ticker);
  const dgcBlock =
    ticker === "DGW" || ticker === "DGC"
      ? formatDgcContextForPrompt(ticker)
      : formatDgcContextForPrompt("DGW");

  return `
HISTORICAL CORPORATE BASELINE — ${ticker} (${c.companyName}):
- Giá hiện tại: ${c.currentPrice.toLocaleString()} VND | Ngành: ${c.sector}
- Doanh thu lịch sử (tỷ VND): ${c.historicalRevenue.join(", ")}
- EBIT (tỷ VND): ${c.historicalEbit.join(", ")}
- CapEx: ${c.capex} | ΔWorking Capital: ${c.workingCapitalChange}
- DuPont: ROE ${(c.roe * 100).toFixed(1)}%, Net Margin ${(c.netMargin * 100).toFixed(1)}%, Asset Turnover ${c.assetTurnover}x, Leverage ${c.leverageRatio}x

${dgcBlock}

DGC TEMPLATE PARAMETERS (embedded):
- Segments: ${DGC_DGW_TEMPLATE.segments.map((s) => s.name).join(" | ")}
- Revenue CAGR: ${DGC_DGW_TEMPLATE.revenueCagrPct}%
- Forecast horizon: ${DGC_DGW_TEMPLATE.dcfHorizonYears} years explicit + terminal
`.trim();
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access blocked" }, { status: 401 });
    }

    const body = await request.json();
    const cleanTicker = (body.ticker || "DGW").toUpperCase().trim();
    const companyData = getCompanySnapshot(cleanTicker);

    const wacc = body.waccInput ?? body.wacc ?? DGC_DGW_TEMPLATE.waccAssumption;
    const g = body.growthInput ?? body.terminalGrowth ?? DGC_DGW_TEMPLATE.terminalGrowthPct;
    const regime = body.regime ?? body.quantResult?.regimeDetected ?? "Risk-On Expansion";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in environment" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" },
    });

    const baseline = buildInstitutionalBaseline(cleanTicker);

    const committeePrompt = `
You are the Chief Risk Officer and Senior Quant at HawkEye Investment Committee (CFA Charter).
Build an institutional-grade risk digest and 5-Year DCF (FCFF) for ${cleanTicker}.

Audience: retail investors upgrading to Pro — clear, evidence-based, Vietnamese executive summary.

${baseline}

Macro: Rf = 6.0%, ERP = 8.0%, Tax = 20%.
WACC = ${wacc}, Terminal g = ${g}, Regime = ${regime}.
Forecast: 2026F–2030F (5 years). Map revenue growth to DGC segments (Mobile phones, Laptops & tablets, Office equipment).

Respond ONLY with valid JSON:
{
  "recommendation": "BUY" | "HOLD" | "SELL",
  "targetPrice": number,
  "convictionScore": number,
  "executiveSummary": "Tóm tắt tiếng Việt",
  "segmentNotes": [
    { "segment": "Mobile phones", "revenueSharePct": number, "growthOutlook": "string" },
    { "segment": "Laptops & tablets", "revenueSharePct": number, "growthOutlook": "string" },
    { "segment": "Office equipment", "revenueSharePct": number, "growthOutlook": "string" }
  ],
  "dupontAnalysis": {
    "roe": "percentage string",
    "netMargin": "percentage string",
    "assetTurnover": "multiplier string",
    "leverageRatio": "multiplier string"
  },
  "dcfForecast": {
    "wacc": ${wacc},
    "terminalGrowth": ${g},
    "terminalValue": number,
    "enterpriseValue": number,
    "forecastYears": [
      { "year": "2026F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
      { "year": "2027F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
      { "year": "2028F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
      { "year": "2029F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
      { "year": "2030F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number }
    ]
  },
  "actionChecklist": ["bước 1", "bước 2", "bước 3"]
}
`.trim();

    const response = await model.generateContent(committeePrompt);
    const parsedData = parseModelJson(response.response.text());

    const htmlReportContent = generateCfaReportTemplate({
      ticker: companyData.ticker,
      companyName: companyData.companyName,
      currentPrice: companyData.currentPrice,
      targetPrice: parsedData.targetPrice ?? companyData.currentPrice,
      convictionScore: parsedData.convictionScore ?? 50,
      regime,
      recommendation: parsedData.recommendation ?? "HOLD",
      executiveSummary: parsedData.executiveSummary ?? "",
      dupontAnalysis: parsedData.dupontAnalysis ?? {
        roe: `${(companyData.roe * 100).toFixed(1)}%`,
        netMargin: `${(companyData.netMargin * 100).toFixed(1)}%`,
        assetTurnover: `${companyData.assetTurnover}x`,
        leverageRatio: `${companyData.leverageRatio}x`,
      },
      dcfForecast: parsedData.dcfForecast,
      segmentNotes: parsedData.segmentNotes,
      actionChecklist: parsedData.actionChecklist ?? [],
    });

    return NextResponse.json({
      success: true,
      ticker: cleanTicker,
      recommendation: parsedData.recommendation,
      convictionScore: parsedData.convictionScore,
      htmlReport: htmlReportContent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Committee analysis failed";
    console.error("AI committee error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
