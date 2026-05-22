/** Legacy shape for components still importing OpenClawAssetRecord */
export interface OpenClawAssetRecord {
  ticker: string;
  companyName: string;
  currentPrice: number;
  revenueBillionVnd: number[];
  ebitBillionVnd: number[];
  fcfQuality: "strong" | "moderate" | "weak";
  roe: number;
  netMargin: number;
  segments?: { name: string; revenueSharePct: number }[];
  technical?: {
    ma20: number;
    ma50: number;
    rsi14: number;
    macdSignal: "bullish" | "bearish" | "neutral";
  };
}
