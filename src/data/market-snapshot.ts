export interface CompanyFinancialSnapshot {
  ticker: string;
  companyName: string;
  currentPrice: number;
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
}

export const marketSnapshotDB: Record<string, CompanyFinancialSnapshot> = {
  FPT: {
    ticker: "FPT",
    companyName: "Công ty Cổ phần FPT",
    currentPrice: 135000,
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
  },
  HPG: {
    ticker: "HPG",
    companyName: "Tập đoàn Hòa Phát",
    currentPrice: 28500,
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
  },
  DGW: {
    ticker: "DGW",
    companyName: "Công ty Cổ phần Digiworld",
    currentPrice: 42000,
    historicalRevenue: [18500, 21200, 24800, 29100, 33500],
    historicalEbit: [820, 1050, 1280, 1540, 1820],
    taxRate: 0.2,
    capex: 680,
    workingCapitalChange: 420,
    roe: 0.182,
    netMargin: 0.052,
    assetTurnover: 1.12,
    leverageRatio: 2.1,
    sector: "Technology",
  },
};

export function getCompanySnapshot(ticker: string): CompanyFinancialSnapshot {
  const key = (ticker || "HPG").toUpperCase().trim();
  return marketSnapshotDB[key] ?? marketSnapshotDB.HPG;
}
