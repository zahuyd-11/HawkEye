import { NextResponse } from "next/server";
import { buildCfaRiskReport } from "@/lib/quant/cfa-risk-report";
import { generateCfaReportTemplate } from "@/lib/ai/pdf-template";
import { HAWKEYE_ENGINE_LABEL } from "@/lib/openclaw/engine";

export const dynamic = "force-dynamic";

/** Deterministic CFA + FCFF DCF report (no LLM required) */
export async function GET(request: Request) {
  const ticker = new URL(request.url).searchParams.get("ticker")?.toUpperCase() ?? "HPG";
  const wacc = Number(new URL(request.url).searchParams.get("wacc")) || undefined;
  const g = Number(new URL(request.url).searchParams.get("g")) || undefined;

  try {
    const report = buildCfaRiskReport(ticker, {
      wacc: wacc && wacc > 0 ? wacc / 100 : undefined,
      terminalGrowth: g && g > 0 ? g / 100 : undefined,
    });

    const htmlReport = generateCfaReportTemplate({
      ticker: report.ticker,
      companyName: report.companyName,
      currentPrice: report.currentPrice,
      targetPrice: report.targetPrice,
      convictionScore: report.convictionScore,
      regime: "HawkEye Quant Regime",
      recommendation: report.recommendation,
      executiveSummary: report.executiveSummary,
      dupontAnalysis: report.dupontAnalysis,
      dcfForecast: report.dcfForecast,
      segmentNotes: report.segmentNotes,
      actionChecklist: report.actionChecklist,
    });

    return NextResponse.json({
      success: true,
      engine: HAWKEYE_ENGINE_LABEL,
      report,
      htmlReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Report build failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
