/** Seeded corporate financial database — curated via OpenClawEngine */

export interface SegmentBreakdown {
  name: string;
  revenueSharePct: number;
  grossMarginPct: number;
  qoqGrowthPct: number;
  yoyGrowthPct: number;
}

export interface CompanyFinancialSnapshot {
  ticker: string;
  companyName: string;
  currentPrice: number;
  periodLabels: string[];
  historicalRevenue: number[];
  historicalEbit: number[];
  taxRate: number;
  capex: number;
  workingCapitalChange: number;
  roe: number;
  netMargin: number;
  assetTurnover: number;
  leverageRatio: number;
  sector: string;
  segments: SegmentBreakdown[];
  dataSource: string;
}

export const marketSnapshotDB: Record<string, CompanyFinancialSnapshot> = {
  FPT: {
    ticker: "FPT",
    companyName: "Công ty Cổ phần FPT",
    currentPrice: 135000,
    periodLabels: ["FY2020", "FY2021", "FY2022", "FY2023", "FY2024"],
    historicalRevenue: [43009, 52618, 61200, 72500, 85600],
    historicalEbit: [7600, 9200, 11100, 13400, 16100],
    taxRate: 0.2,
    capex: 4500,
    workingCapitalChange: 1200,
    roe: 0.245,
    netMargin: 0.165,
    assetTurnover: 0.82,
    leverageRatio: 1.65,
    sector: "Technology",
    dataSource: "openclaw.vn30.seed",
    segments: [
      { name: "Technology services", revenueSharePct: 55, grossMarginPct: 18.2, qoqGrowthPct: 3.1, yoyGrowthPct: 14.2 },
      { name: "Telecom", revenueSharePct: 30, grossMarginPct: 12.5, qoqGrowthPct: 1.8, yoyGrowthPct: 8.5 },
      { name: "Education / Other", revenueSharePct: 15, grossMarginPct: 22.0, qoqGrowthPct: 2.4, yoyGrowthPct: 11.0 },
    ],
  },
  HPG: {
    ticker: "HPG",
    companyName: "Tập đoàn Hòa Phát",
    currentPrice: 28500,
    periodLabels: ["FY2020", "FY2021", "FY2022", "FY2023", "FY2024"],
    historicalRevenue: [150800, 142400, 120500, 138200, 155000],
    historicalEbit: [18200, 11400, 8500, 14100, 17800],
    taxRate: 0.2,
    capex: 12500,
    workingCapitalChange: -2100,
    roe: 0.128,
    netMargin: 0.098,
    assetTurnover: 0.64,
    leverageRatio: 1.84,
    sector: "Steel",
    dataSource: "openclaw.vn30.seed",
    segments: [
      { name: "Thép xây dựng", revenueSharePct: 48, grossMarginPct: 11.2, qoqGrowthPct: 2.5, yoyGrowthPct: 8.8 },
      { name: "Thép cán nguội / mạ", revenueSharePct: 28, grossMarginPct: 9.8, qoqGrowthPct: 1.2, yoyGrowthPct: 5.4 },
      { name: "Nông nghiệp / Khác", revenueSharePct: 24, grossMarginPct: 14.5, qoqGrowthPct: 3.8, yoyGrowthPct: 12.1 },
    ],
  },
  VCB: {
    ticker: "VCB",
    companyName: "Ngân hàng TMCP Ngoại thương Việt Nam",
    currentPrice: 98500,
    periodLabels: ["FY2020", "FY2021", "FY2022", "FY2023", "FY2024"],
    historicalRevenue: [48200, 52800, 61200, 70100, 78500],
    historicalEbit: [22100, 24500, 28100, 31200, 34800],
    taxRate: 0.2,
    capex: 2100,
    workingCapitalChange: 800,
    roe: 0.22,
    netMargin: 0.42,
    assetTurnover: 0.035,
    leverageRatio: 8.2,
    sector: "Banking",
    dataSource: "openclaw.vn30.seed",
    segments: [
      { name: "Cho vay bán lẻ", revenueSharePct: 45, grossMarginPct: 55, qoqGrowthPct: 2.1, yoyGrowthPct: 12.0 },
      { name: "Doanh nghiệp", revenueSharePct: 35, grossMarginPct: 48, qoqGrowthPct: 1.5, yoyGrowthPct: 9.5 },
      { name: "Dịch vụ / Khác", revenueSharePct: 20, grossMarginPct: 62, qoqGrowthPct: 3.0, yoyGrowthPct: 14.2 },
    ],
  },
  DGW: {
    ticker: "DGW",
    companyName: "Công ty Cổ phần Digiworld",
    currentPrice: 42000,
    periodLabels: ["FY2020", "FY2021", "FY2022", "FY2023", "FY2024"],
    historicalRevenue: [18500, 21200, 24800, 29100, 33500],
    historicalEbit: [820, 1050, 1280, 1540, 1820],
    taxRate: 0.2,
    capex: 680,
    workingCapitalChange: 420,
    roe: 0.182,
    netMargin: 0.052,
    assetTurnover: 1.12,
    leverageRatio: 2.1,
    sector: "Technology Distribution",
    dataSource: "openclaw.dgc.template",
    segments: [
      { name: "Mobile phones", revenueSharePct: 52, grossMarginPct: 6.8, qoqGrowthPct: 4.2, yoyGrowthPct: 12.5 },
      { name: "Laptops & tablets", revenueSharePct: 28, grossMarginPct: 7.5, qoqGrowthPct: 2.8, yoyGrowthPct: 9.8 },
      { name: "Office equipment", revenueSharePct: 20, grossMarginPct: 11.2, qoqGrowthPct: 1.5, yoyGrowthPct: 6.2 },
    ],
  },
};

export function getCompanySnapshot(ticker: string): CompanyFinancialSnapshot {
  const key = (ticker || "HPG").toUpperCase().trim();
  return marketSnapshotDB[key] ?? marketSnapshotDB.HPG;
}
