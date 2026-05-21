export const SECTOR_OPTIONS = [
  { id: "Technology", label: "Công nghệ" },
  { id: "Steel", label: "Thép" },
  { id: "Banking", label: "Ngân hàng" },
  { id: "Retail", label: "Bán lẻ" },
  { id: "RealEstate", label: "Bất động sản" },
  { id: "Energy", label: "Dầu khí" },
] as const;

const SECTOR_TICKER: Record<string, string> = {
  Technology: "FPT",
  Steel: "HPG",
  RealEstate: "VHM",
  Banking: "VCB",
  Retail: "MWG",
  Energy: "GAS",
};

export interface DnaInputs {
  capital: number;
  maxDrawdown: number;
  selectedSectors: string[];
  biasLossAversion: string;
  biasOverconfidence: string;
  biasHerdFomo: string;
}

export function formatVnd(num: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

export function parseCapitalInput(val: string) {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

export function formatCapitalInput(raw: string) {
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

export function calculateDnaPortfolio(inputs: DnaInputs) {
  const { capital, maxDrawdown, selectedSectors, biasLossAversion, biasOverconfidence, biasHerdFomo } =
    inputs;
  const absDrawdown = Math.abs(maxDrawdown);

  let growthWeight = Math.min(80, Math.max(10, absDrawdown * 1.8));
  let cashWeight = Math.min(70, Math.max(10, 100 - absDrawdown * 2.2));
  let defensiveWeight = 100 - growthWeight - cashWeight;

  if (biasLossAversion === "buy_more") {
    growthWeight = Math.min(85, growthWeight * 1.1);
    cashWeight = Math.max(5, cashWeight * 0.8);
    defensiveWeight = 100 - growthWeight - cashWeight;
  }
  if (biasOverconfidence === "double") {
    growthWeight = Math.min(90, growthWeight * 1.15);
    cashWeight = Math.max(5, cashWeight * 0.7);
    defensiveWeight = 100 - growthWeight - cashWeight;
  }

  const total = growthWeight + defensiveWeight + cashWeight;
  growthWeight = parseFloat(((growthWeight / total) * 100).toFixed(1));
  defensiveWeight = parseFloat(((defensiveWeight / total) * 100).toFixed(1));
  cashWeight = parseFloat(((cashWeight / total) * 100).toFixed(1));

  const growthSectors = selectedSectors.filter((s) =>
    ["Technology", "Steel", "RealEstate"].includes(s)
  );
  const defensiveSectors = selectedSectors.filter((s) =>
    ["Banking", "Retail", "Energy"].includes(s)
  );

  const growthAssets: Array<{ ticker: string; name: string; weight: number; capital: number }> = [];
  const defensiveAssets: Array<{ ticker: string; name: string; weight: number; capital: number }> = [];

  if (growthSectors.length > 0) {
    const w = growthWeight / growthSectors.length;
    growthSectors.forEach((sec) => {
      growthAssets.push({
        ticker: SECTOR_TICKER[sec] || sec,
        name: sec,
        weight: w,
        capital: Math.round((w / 100) * capital),
      });
    });
  } else {
    growthAssets.push({
      ticker: "FPT",
      name: "FPT (default)",
      weight: growthWeight,
      capital: Math.round((growthWeight / 100) * capital),
    });
  }

  if (defensiveSectors.length > 0) {
    const w = (defensiveWeight * 0.6) / defensiveSectors.length;
    defensiveSectors.forEach((sec) => {
      defensiveAssets.push({
        ticker: SECTOR_TICKER[sec] || sec,
        name: sec,
        weight: w,
        capital: Math.round((w / 100) * capital),
      });
    });
    const bondW = defensiveWeight * 0.4;
    defensiveAssets.push({
      ticker: "VGBOND_10Y",
      name: "Trái phiếu CP 10Y",
      weight: bondW,
      capital: Math.round((bondW / 100) * capital),
    });
  } else {
    defensiveAssets.push({
      ticker: "VGBOND_10Y",
      name: "Trái phiếu CP 10Y",
      weight: defensiveWeight,
      capital: Math.round((defensiveWeight / 100) * capital),
    });
  }

  const cashAssets = [
    {
      ticker: "CASH",
      name: "Tiền mặt",
      weight: cashWeight * 0.7,
      capital: Math.round(((cashWeight * 0.7) / 100) * capital),
    },
    {
      ticker: "GOLD",
      name: "Vàng phòng thủ",
      weight: cashWeight * 0.3,
      capital: Math.round(((cashWeight * 0.3) / 100) * capital),
    },
  ];

  let profileTitle = "Bảo Toàn Bền Vững";
  let profileDesc = "Ưu tiên bảo vệ vốn, phù hợp drawdown thấp.";
  let activeAIModes = ["Capital Preservation Guard", "Stop-Loss -5%"];

  if (absDrawdown >= 25) {
    profileTitle = "Tăng Trưởng Tấn Công";
    profileDesc = "Chấp nhận biến động cao để săn alpha.";
    activeAIModes = ["Aggressive Opportunity Finder", "Momentum Guard"];
  } else if (absDrawdown >= 12) {
    profileTitle = "Cân Bằng Động";
    profileDesc = "Cân bằng growth và phòng thủ.";
    activeAIModes = ["Balanced Accumulation", "FSA Forensic Auditor"];
  }

  if (biasHerdFomo === "buy_chase") activeAIModes.push("FOMO Shock Absorber");
  if (biasLossAversion === "buy_more") activeAIModes.push("Loss Aversion Shield");

  return {
    profileTitle,
    profileDesc,
    activeAIModes,
    allocationData: [
      { name: "Growth", value: growthWeight, color: "#3B82F6" },
      { name: "Defensive", value: defensiveWeight, color: "#10B981" },
      { name: "Cash", value: cashWeight, color: "#6B7280" },
    ],
    positions: [...growthAssets, ...defensiveAssets, ...cashAssets],
  };
}
