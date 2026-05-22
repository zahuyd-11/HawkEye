/**
 * CFA-standard 5-year FCFF DCF (deterministic) — HawkEye Risk Analytics Engine
 * FCFF = EBIT×(1−T) − CapEx − ΔWorking Capital
 * TV = FCFF_n×(1+g) / (WACC−g); EV = Σ PV(FCFF) + PV(TV)
 */
import type { CompanyFinancialSnapshot } from "@/data/market-snapshot";
import { applyLivePriceToSnapshot } from "@/lib/openclaw/vn30-crawler";

export interface DcfYearRow {
  year: string;
  revenue: number;
  ebit: number;
  tax: number;
  nopat: number;
  capex: number;
  workingCapitalChange: number;
  fcff: number;
  discountFactor: number;
  pvFcff: number;
}

export interface DcfFcffResult {
  wacc: number;
  terminalGrowth: number;
  taxRate: number;
  forecastYears: DcfYearRow[];
  terminalFcff: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValuePerShare: number;
  targetPrice: number;
  upsidePct: number;
  impliedPe: number | null;
}

export interface DcfAssumptions {
  wacc?: number;
  terminalGrowth?: number;
  revenueCagr?: number;
  projectionYears?: number;
  sharesOutstandingM?: number;
  netDebtBillion?: number;
}

const DEFAULT_WACC = 0.112;
const DEFAULT_G = 0.03;
const DEFAULT_TAX = 0.2;

function cagrFromHistory(revenues: number[]): number {
  if (revenues.length < 2) return 0.08;
  const first = revenues[0];
  const last = revenues[revenues.length - 1];
  if (first <= 0 || last <= 0) return 0.08;
  const years = revenues.length - 1;
  const rate = Math.pow(last / first, 1 / years) - 1;
  return Math.min(Math.max(rate, 0.02), 0.25);
}

export function buildFcffDcf(
  snap: CompanyFinancialSnapshot,
  assumptions: DcfAssumptions = {}
): DcfFcffResult {
  const wacc = assumptions.wacc ?? DEFAULT_WACC;
  const terminalGrowth = assumptions.terminalGrowth ?? DEFAULT_G;
  const taxRate = snap.taxRate ?? DEFAULT_TAX;
  const years = assumptions.projectionYears ?? 5;
  const revenueCagr =
    assumptions.revenueCagr ?? cagrFromHistory(snap.historicalRevenue);

  const lastRev = snap.historicalRevenue[snap.historicalRevenue.length - 1] ?? 0;
  const lastEbit = snap.historicalEbit[snap.historicalEbit.length - 1] ?? 0;
  const ebitMargin = lastRev > 0 ? lastEbit / lastRev : snap.netMargin;

  const capexRatio = lastRev > 0 ? snap.capex / lastRev : 0.08;
  const wcRatio = lastRev > 0 ? snap.workingCapitalChange / lastRev : 0.02;

  const forecastYears: DcfYearRow[] = [];
  let revenue = lastRev;

  for (let i = 1; i <= years; i++) {
    revenue = revenue * (1 + revenueCagr);
    const ebit = revenue * ebitMargin;
    const tax = ebit * taxRate;
    const nopat = ebit - tax;
    const capex = revenue * capexRatio;
    const workingCapitalChange = revenue * wcRatio;
    const fcff = nopat - capex - workingCapitalChange;
    const discountFactor = 1 / Math.pow(1 + wacc, i);
    const pvFcff = fcff * discountFactor;

    forecastYears.push({
      year: `${2025 + i}F`,
      revenue: Math.round(revenue),
      ebit: Math.round(ebit),
      tax: Math.round(tax),
      nopat: Math.round(nopat),
      capex: Math.round(capex),
      workingCapitalChange: Math.round(workingCapitalChange),
      fcff: Math.round(fcff),
      discountFactor: parseFloat(discountFactor.toFixed(4)),
      pvFcff: Math.round(pvFcff),
    });
  }

  const lastFcff = forecastYears[forecastYears.length - 1]?.fcff ?? 0;
  const terminalFcff = lastFcff * (1 + terminalGrowth);
  const terminalValue =
    wacc > terminalGrowth ? terminalFcff / (wacc - terminalGrowth) : 0;
  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, years);

  const sumPvFcff = forecastYears.reduce((s, y) => s + y.pvFcff, 0);
  const enterpriseValue = Math.round(sumPvFcff + pvTerminalValue);

  const sharesM = assumptions.sharesOutstandingM ?? 5800;
  const netDebt = assumptions.netDebtBillion ?? 0;
  const equityValue = enterpriseValue - netDebt;
  const equityValuePerShare = Math.round((equityValue * 1e9) / (sharesM * 1e6));

  const currentPrice = applyLivePriceToSnapshot(snap.ticker);
  const upsidePct =
    currentPrice > 0
      ? parseFloat(
          (((equityValuePerShare - currentPrice) / currentPrice) * 100).toFixed(1)
        )
      : 0;

  const eps = snap.netMargin * (lastRev * 1e9) / (sharesM * 1e6);
  const impliedPe = eps > 0 ? equityValuePerShare / eps : null;

  return {
    wacc,
    terminalGrowth,
    taxRate,
    forecastYears,
    terminalFcff: Math.round(terminalFcff),
    terminalValue: Math.round(terminalValue),
    pvTerminalValue: Math.round(pvTerminalValue),
    enterpriseValue,
    equityValuePerShare,
    targetPrice: equityValuePerShare,
    upsidePct,
    impliedPe: impliedPe ? parseFloat(impliedPe.toFixed(1)) : null,
  };
}

export function dcfRecommendation(
  upsidePct: number
): "BUY" | "HOLD" | "SELL" {
  if (upsidePct >= 15) return "BUY";
  if (upsidePct <= -10) return "SELL";
  return "HOLD";
}

export function buildDupontFromSnapshot(snap: CompanyFinancialSnapshot) {
  return {
    roe: `${(snap.roe * 100).toFixed(1)}%`,
    netMargin: `${(snap.netMargin * 100).toFixed(1)}%`,
    assetTurnover: `${snap.assetTurnover.toFixed(2)}x`,
    leverageRatio: `${snap.leverageRatio.toFixed(2)}x`,
  };
}
