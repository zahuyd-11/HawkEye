/**
 * OpenClaw — Data Ingestion & Curation Engine for HawkEye
 * Sanitizes raw financial matrices into time-series JSON for AI valuation layers.
 */
import {
  getCompanySnapshot,
  marketSnapshotDB,
  type CompanyFinancialSnapshot,
  type SegmentBreakdown,
} from "@/data/market-snapshot";
import { applyLivePriceToSnapshot } from "@/lib/openclaw/vn30-crawler";
import { getLiveQuote } from "@/lib/openclaw/vn30-store";

export const HAWKEYE_ENGINE_LABEL = "HawkEye Risk Analytics Engine";

export interface DataLineage {
  field: string;
  source: string;
  extractedAt: string;
}

export interface TimeSeriesPoint {
  period: string;
  revenueBillionVnd: number;
  ebitBillionVnd: number;
  capexBillionVnd: number;
  workingCapitalChangeBillionVnd: number;
  qoqRevenuePct: number | null;
  yoyRevenuePct: number | null;
  lineage: DataLineage;
}

export interface CuratedFinancialProfile {
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  taxRate: number;
  roe: number;
  netMargin: number;
  assetTurnover: number;
  leverageRatio: number;
  fcfQuality: "strong" | "moderate" | "weak";
  segments: SegmentBreakdown[];
  consolidatedSeries: TimeSeriesPoint[];
  auditTrail: DataLineage[];
  lastCuratedAt: string;
}

export interface RawFinancialRow {
  period?: string;
  year?: string | number;
  quarter?: string;
  revenue?: unknown;
  ebit?: unknown;
  capex?: unknown;
  workingCapitalChange?: unknown;
  segment?: string;
  [key: string]: unknown;
}

function safeNum(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return fallback;
    return value;
  }
  const s = String(value).replace(/,/g, "").replace(/%/g, "").trim();
  if (s === "" || s === "-" || s.toLowerCase() === "n/a") return fallback;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0 || !Number.isFinite(previous)) return null;
  return parseFloat((((current - previous) / Math.abs(previous)) * 100).toFixed(2));
}

function periodLabel(row: RawFinancialRow, index: number): string {
  if (row.period) return String(row.period);
  if (row.quarter && row.year) return `Q${row.quarter}-${row.year}`;
  if (row.year) return `FY${row.year}`;
  return `P${index + 1}`;
}

function inferFcfQuality(netMargin: number): CuratedFinancialProfile["fcfQuality"] {
  if (netMargin > 0.12) return "strong";
  if (netMargin > 0.06) return "moderate";
  return "weak";
}

export class OpenClawEngine {
  private readonly curatedAt = new Date().toISOString();

  /** Sanitize & structure a raw ingestion matrix (Excel/CSV/API rows). */
  curateRawFinancials(
    rawMatrix: RawFinancialRow[],
    meta: { ticker: string; companyName?: string; source?: string }
  ): CuratedFinancialProfile {
    const ticker = meta.ticker.toUpperCase().trim();
    const baseline = getCompanySnapshot(ticker);
    const source = meta.source ?? "openclaw.ingest";

    const sorted = [...rawMatrix].sort((a, b) => {
      const ya = safeNum(a.year, 0);
      const yb = safeNum(b.year, 0);
      return ya - yb;
    });

    const consolidatedSeries: TimeSeriesPoint[] = [];
    sorted.forEach((row, i) => {
      const revenue = safeNum(row.revenue ?? row.revenueBillionVnd);
      const ebit = safeNum(row.ebit ?? row.ebitBillionVnd);
      const prev = consolidatedSeries[i - 1];
      const period = periodLabel(row, i);

      consolidatedSeries.push({
        period,
        revenueBillionVnd: revenue,
        ebitBillionVnd: ebit,
        capexBillionVnd: safeNum(row.capex, baseline.capex / Math.max(sorted.length, 1)),
        workingCapitalChangeBillionVnd: safeNum(
          row.workingCapitalChange,
          baseline.workingCapitalChange
        ),
        qoqRevenuePct: prev ? pctChange(revenue, prev.revenueBillionVnd) : null,
        yoyRevenuePct: null,
        lineage: {
          field: `consolidated.${period}`,
          source: `${source} row ${i + 1}`,
          extractedAt: this.curatedAt,
        },
      });
    });

    consolidatedSeries.forEach((pt, i) => {
      if (i >= 1) {
        const prevYear = consolidatedSeries[i - 1];
        pt.yoyRevenuePct = pctChange(pt.revenueBillionVnd, prevYear.revenueBillionVnd);
      }
    });

    const segmentMap = new Map<string, number>();
    sorted.forEach((row) => {
      const seg = row.segment ? String(row.segment) : "Consolidated";
      segmentMap.set(seg, (segmentMap.get(seg) ?? 0) + safeNum(row.revenue));
    });
    const totalSegRev = Array.from(segmentMap.values()).reduce((a, b) => a + b, 0) || 1;

    const segments: SegmentBreakdown[] =
      baseline.segments.length > 0
        ? baseline.segments
        : Array.from(segmentMap.entries()).map(([name, rev]) => ({
            name,
            revenueSharePct: parseFloat(((rev / totalSegRev) * 100).toFixed(1)),
            grossMarginPct: baseline.netMargin * 100 * 0.85,
            qoqGrowthPct: 0,
            yoyGrowthPct: 0,
          }));

    const lastRev =
      consolidatedSeries[consolidatedSeries.length - 1]?.revenueBillionVnd ??
      baseline.historicalRevenue[baseline.historicalRevenue.length - 1];

    const lastEbit =
      consolidatedSeries[consolidatedSeries.length - 1]?.ebitBillionVnd ??
      baseline.historicalEbit[baseline.historicalEbit.length - 1];

    const netMargin = lastRev > 0 ? lastEbit / lastRev : baseline.netMargin;

    return {
      ticker,
      companyName: meta.companyName ?? baseline.companyName,
      sector: baseline.sector,
      currentPrice: applyLivePriceToSnapshot(ticker),
      taxRate: baseline.taxRate,
      roe: baseline.roe,
      netMargin,
      assetTurnover: baseline.assetTurnover,
      leverageRatio: baseline.leverageRatio,
      fcfQuality: inferFcfQuality(netMargin),
      segments,
      consolidatedSeries:
        consolidatedSeries.length > 0
          ? consolidatedSeries
          : this.snapshotToSeries(baseline),
      auditTrail: consolidatedSeries.map((p) => p.lineage),
      lastCuratedAt: this.curatedAt,
    };
  }

  private snapshotToSeries(snap: CompanyFinancialSnapshot): TimeSeriesPoint[] {
    return snap.historicalRevenue.map((rev, i) => ({
      period: snap.periodLabels?.[i] ?? `FY${2020 + i}`,
      revenueBillionVnd: rev,
      ebitBillionVnd: snap.historicalEbit[i] ?? 0,
      capexBillionVnd: snap.capex,
      workingCapitalChangeBillionVnd: snap.workingCapitalChange,
      qoqRevenuePct: i > 0 ? pctChange(rev, snap.historicalRevenue[i - 1]) : null,
      yoyRevenuePct: null,
      lineage: {
        field: `seed.${snap.ticker}.${i}`,
        source: "market-snapshot.seed",
        extractedAt: this.curatedAt,
      },
    }));
  }

  /** Load curated profile from seeded OpenClaw database (VN30 baseline). */
  getCuratedSnapshot(ticker: string): CuratedFinancialProfile {
    const snap = getCompanySnapshot(ticker);
    const series = this.snapshotToSeries(snap);

    series.forEach((pt, i) => {
      if (i > 0) pt.yoyRevenuePct = pctChange(pt.revenueBillionVnd, series[i - 1].revenueBillionVnd);
    });

    return {
      ticker: snap.ticker,
      companyName: snap.companyName,
      sector: snap.sector,
      currentPrice: applyLivePriceToSnapshot(snap.ticker),
      taxRate: snap.taxRate,
      roe: snap.roe,
      netMargin: snap.netMargin,
      assetTurnover: snap.assetTurnover,
      leverageRatio: snap.leverageRatio,
      fcfQuality: inferFcfQuality(snap.netMargin),
      segments: snap.segments,
      consolidatedSeries: series,
      auditTrail: series.map((p) => p.lineage),
      lastCuratedAt: this.curatedAt,
    };
  }

  /** Text block for HawkEye Risk Analytics Engine prompts. */
  buildAiContextBlock(ticker: string): string {
    const p = this.getCuratedSnapshot(ticker);
    const segLines = p.segments
      .map(
        (s) =>
          `  - ${s.name}: ${s.revenueSharePct}% DT | GM ${s.grossMarginPct}% | QoQ +${s.qoqGrowthPct}%`
      )
      .join("\n");

    const tsLines = p.consolidatedSeries
      .map(
        (t) =>
          `  ${t.period}: DT ${t.revenueBillionVnd} tỷ | EBIT ${t.ebitBillionVnd} tỷ | QoQ ${t.qoqRevenuePct ?? "—"}% | YoY ${t.yoyRevenuePct ?? "—"}% [${t.lineage.source}]`
      )
      .join("\n");

    return `
OPENCLAW CURATED DATA (${HAWKEYE_ENGINE_LABEL})
Ticker: ${p.ticker} | ${p.companyName} | ${p.sector}
Price: ${p.currentPrice.toLocaleString("vi-VN")} VND (${getLiveQuote(p.ticker)?.source ?? "seed"}) | FCF quality: ${p.fcfQuality}
ROE ${(p.roe * 100).toFixed(1)}% | Net margin ${(p.netMargin * 100).toFixed(1)}% | Leverage ${p.leverageRatio}x
Tax ${(p.taxRate * 100).toFixed(0)}% | CapEx baseline ${p.consolidatedSeries.at(-1)?.capexBillionVnd ?? 0} tỷ
Curated at: ${p.lastCuratedAt}

SEGMENT BREAKDOWN:
${segLines || "  — consolidated only"}

TIME-SERIES (tỷ VND):
${tsLines}

AUDIT: ${p.auditTrail.length} lineage tags attached — do not invent figures outside this block.
`.trim();
  }

  listAvailableTickers(): string[] {
    return Object.keys(marketSnapshotDB);
  }
}

export const openClawEngine = new OpenClawEngine();

export function getOpenClawContextBundle(tickers: string[] = ["HPG", "DGW", "FPT"]): string {
  return tickers
    .map((t) => openClawEngine.buildAiContextBlock(t))
    .filter(Boolean)
    .join("\n\n---\n\n");
}
