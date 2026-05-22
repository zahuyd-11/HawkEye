import { getCompanySnapshot } from "@/data/market-snapshot";
import { openClawEngine } from "@/lib/openclaw/engine";
import { getLiveQuote, readVn30Cache } from "@/lib/openclaw/vn30-store";
import { applyLivePriceToSnapshot } from "@/lib/openclaw/vn30-crawler";
import {
  buildFcffDcf,
  buildDupontFromSnapshot,
  dcfRecommendation,
  type DcfFcffResult,
} from "@/lib/quant/dcf-fcff";
import { DGC_DGW_TEMPLATE } from "@/data/dgc-template";

export interface CfaRiskReport {
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  priceSource: string;
  recommendation: "BUY" | "HOLD" | "SELL";
  targetPrice: number;
  upsidePct: number;
  convictionScore: number;
  riskScore: number;
  executiveSummary: string;
  dupontAnalysis: ReturnType<typeof buildDupontFromSnapshot>;
  segmentNotes: Array<{
    segment: string;
    revenueSharePct: number;
    growthOutlook: string;
  }>;
  dcfForecast: {
    wacc: number;
    terminalGrowth: number;
    terminalValue: number;
    enterpriseValue: number;
    forecastYears: DcfFcffResult["forecastYears"];
  };
  actionChecklist: string[];
  openClawCuratedAt: string;
  dataLineage: string;
}

function convictionFromUpside(upside: number): number {
  return Math.min(95, Math.max(35, Math.round(50 + upside * 1.2)));
}

function riskScoreFromLeverage(leverage: number, margin: number): number {
  let score = 5;
  if (leverage > 2) score += 1;
  if (margin < 0.06) score += 1;
  if (leverage < 1.5 && margin > 0.12) score -= 1;
  return Math.min(10, Math.max(1, score));
}

export function buildCfaRiskReport(
  ticker: string,
  opts?: { wacc?: number; terminalGrowth?: number }
): CfaRiskReport {
  const snap = getCompanySnapshot(ticker);
  const profile = openClawEngine.getCuratedSnapshot(ticker);
  const live = getLiveQuote(ticker);
  const currentPrice = applyLivePriceToSnapshot(ticker);

  const wacc = opts?.wacc ?? DGC_DGW_TEMPLATE.waccAssumption;
  const terminalGrowth = opts?.terminalGrowth ?? DGC_DGW_TEMPLATE.terminalGrowthPct;

  const dcf = buildFcffDcf(snap, { wacc, terminalGrowth });
  const recommendation = dcfRecommendation(dcf.upsidePct);

  const segmentNotes = profile.segments.map((s) => ({
    segment: s.name,
    revenueSharePct: s.revenueSharePct,
    growthOutlook: `YoY +${s.yoyGrowthPct}% · QoQ +${s.qoqGrowthPct}% · GM ${s.grossMarginPct}%`,
  }));

  const priceSource = live
    ? `${live.source} @ ${new Date(live.fetchedAt).toLocaleString("vi-VN")}`
    : snap.dataSource;

  const cache = readVn30Cache();
  const dataLineage = cache.lastIngestAt
    ? `OpenClaw VN30 ingest ${cache.ingestStatus} · ${cache.lastIngestAt}`
    : profile.auditTrail[0]?.source ?? snap.dataSource;

  const executiveSummary = [
    `${snap.companyName} (${ticker}) — ${recommendation} theo mô hình FCFF 5 năm (WACC ${(wacc * 100).toFixed(1)}%, g ${(terminalGrowth * 100).toFixed(1)}%).`,
    `Giá thị trường ${currentPrice.toLocaleString("vi-VN")} VND · Giá trị nội tại ${dcf.targetPrice.toLocaleString("vi-VN")} VND (${dcf.upsidePct >= 0 ? "+" : ""}${dcf.upsidePct}%).`,
    `ROE ${(snap.roe * 100).toFixed(1)}% · Biên ròng ${(snap.netMargin * 100).toFixed(1)}% · ${profile.fcfQuality === "strong" ? "Dòng tiền mạnh" : profile.fcfQuality === "moderate" ? "Dòng tiền trung bình" : "Theo dõi FCF"}.`,
  ].join(" ");

  return {
    ticker: snap.ticker,
    companyName: snap.companyName,
    sector: snap.sector,
    currentPrice,
    priceSource,
    recommendation,
    targetPrice: dcf.targetPrice,
    upsidePct: dcf.upsidePct,
    convictionScore: convictionFromUpside(dcf.upsidePct),
    riskScore: riskScoreFromLeverage(snap.leverageRatio, snap.netMargin),
    executiveSummary,
    dupontAnalysis: buildDupontFromSnapshot(snap),
    segmentNotes,
    dcfForecast: {
      wacc: dcf.wacc,
      terminalGrowth: dcf.terminalGrowth,
      terminalValue: dcf.terminalValue,
      enterpriseValue: dcf.enterpriseValue,
      forecastYears: dcf.forecastYears,
    },
    actionChecklist: [
      `Theo dõi WACC ±100bps (hiện ${(wacc * 100).toFixed(1)}%) — nhạy với EV.`,
      `Rà soát tăng trưởng doanh thu theo mảng: ${profile.segments.map((s) => s.name).join(", ")}.`,
      `Cập nhật giá live qua OpenClaw VN30 ingest (${priceSource}).`,
    ],
    openClawCuratedAt: profile.lastCuratedAt,
    dataLineage,
  };
}
