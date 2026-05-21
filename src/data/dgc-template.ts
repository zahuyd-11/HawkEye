/** DGC / DGW corporate knowledge snapshot for Deal Digest & Committee AI */
export interface SegmentBreakdown {
  name: string;
  revenueSharePct: number;
  grossMarginPct: number;
  qoqGrowthPct: number;
}

export interface DgcTemplateSnapshot {
  ticker: string;
  companyName: string;
  fiscalYearLabel: string;
  historicalMargins: { year: string; grossMarginPct: number; ebitMarginPct: number }[];
  segments: SegmentBreakdown[];
  dcfHorizonYears: number;
  baseRevenueBillionVnd: number;
  revenueCagrPct: number;
  waccAssumption: number;
  terminalGrowthPct: number;
}

export const DGC_DGW_TEMPLATE: DgcTemplateSnapshot = {
  ticker: "DGW",
  companyName: "Công ty Cổ phần Digiworld (DGC Group distribution)",
  fiscalYearLabel: "FY2024 snapshot",
  historicalMargins: [
    { year: "2020", grossMarginPct: 8.2, ebitMarginPct: 3.1 },
    { year: "2021", grossMarginPct: 8.8, ebitMarginPct: 3.4 },
    { year: "2022", grossMarginPct: 9.1, ebitMarginPct: 3.8 },
    { year: "2023", grossMarginPct: 9.4, ebitMarginPct: 4.2 },
    { year: "2024", grossMarginPct: 9.8, ebitMarginPct: 4.6 },
  ],
  segments: [
    { name: "Mobile phones", revenueSharePct: 52, grossMarginPct: 6.8, qoqGrowthPct: 4.2 },
    { name: "Laptops & tablets", revenueSharePct: 28, grossMarginPct: 7.5, qoqGrowthPct: 2.8 },
    { name: "Office equipment", revenueSharePct: 20, grossMarginPct: 11.2, qoqGrowthPct: 1.5 },
  ],
  dcfHorizonYears: 5,
  baseRevenueBillionVnd: 33.5,
  revenueCagrPct: 14.5,
  waccAssumption: 0.112,
  terminalGrowthPct: 0.03,
};

export function formatDgcContextForPrompt(ticker: string): string {
  const t = DGC_DGW_TEMPLATE;
  const segmentLines = t.segments
    .map(
      (s) =>
        `  - ${s.name}: ${s.revenueSharePct}% doanh thu | GM ${s.grossMarginPct}% | QoQ +${s.qoqGrowthPct}%`
    )
    .join("\n");
  const marginLines = t.historicalMargins
    .map((m) => `  ${m.year}: GM ${m.grossMarginPct}% | EBIT margin ${m.ebitMarginPct}%`)
    .join("\n");

  return `
DGC/DGW DISTRIBUTION TEMPLATE — ${ticker} (${t.companyName})
${t.fiscalYearLabel} | Base revenue ${t.baseRevenueBillionVnd} tỷ VND | CAGR dự phóng ${t.revenueCagrPct}%
WACC giả định ${(t.waccAssumption * 100).toFixed(1)}% | Terminal g ${(t.terminalGrowthPct * 100).toFixed(1)}%

PHÂN KHÚC DOANH THU (bắt buộc map vào DCF 5 năm theo từng segment):
${segmentLines}

BIÊN LỢI NHUẬN LỊCH SỬ:
${marginLines}

Yêu cầu: Dự phóng Doanh thu / EBIT / Capex / PV FCFF theo 3 segment trên, tổng hợp thành bảng 5-Year DCF chuẩn CFA.
`.trim();
}
