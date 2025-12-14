/**
 * Strategy Engine - Maps Risk Survey Score to Investment Profile
 */

export type InvestorProfile = "DEFENSIVE" | "BALANCED" | "AGGRESSIVE";

export interface AssetAllocation {
  stocks: number; // Percentage
  etfs?: number; // Percentage (for defensive & balanced profiles)
  bonds: number; // Percentage
  cash: number; // Percentage
  alternatives?: number; // Percentage (for aggressive profile)
}

export interface StopLossRule {
  min: number; // Percentage (negative)
  max: number; // Percentage (negative)
  description: string;
}

export interface StrategyProfile {
  id: InvestorProfile;
  name: string;
  nameVietnamese: string;
  description: string;
  allocation: AssetAllocation;
  stopLoss: StopLossRule;
  takeProfit: {
    firstTarget: number; // Percentage to sell at first target
    firstTargetPercent: number; // Percentage of position
    secondTarget?: number;
    secondTargetPercent?: number;
  };
  focusStocks: string[];
  maxPositionSize: number; // Max % of NAV per stock
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

/**
 * Calculate investor profile based on survey score
 */
export function calculateStrategy(score: number): StrategyProfile {
  if (score >= 31) {
    return getAggressiveProfile();
  } else if (score >= 21) {
    return getBalancedProfile();
  } else {
    return getDefensiveProfile();
  }
}

/**
 * Profile A: Defensive (Bảo Toàn) - Score 10-20
 */
function getDefensiveProfile(): StrategyProfile {
  return {
    id: "DEFENSIVE",
    name: "Defensive",
    nameVietnamese: "Nhà đầu tư Bảo Toàn",
    description:
      "Chiến lược tập trung vào bảo toàn vốn với rủi ro thấp. Phù hợp cho nhà đầu tư ưu tiên an toàn và thu nhập ổn định.",
    allocation: {
      stocks: 15,
      etfs: 15, // ETFs: VFMVN30, FUEVFVND
      bonds: 50,
      cash: 20,
    },
    stopLoss: {
      min: -5,
      max: -5,
      description: "Cắt lỗ nghiêm ngặt ở -5%",
    },
    takeProfit: {
      firstTarget: 10,
      firstTargetPercent: 50, // Sell 50% at +10%
      secondTarget: 20,
      secondTargetPercent: 30, // Sell 30% more at +20%
    },
    focusStocks: ["VNM", "FPT", "VCB", "TCB", "VRE"], // Dividend stocks, Bluechips
    maxPositionSize: 15, // Max 15% NAV per stock
    riskLevel: "LOW",
  };
}

/**
 * Profile B: Balanced (Cân Bằng) - Score 21-30
 */
function getBalancedProfile(): StrategyProfile {
  return {
    id: "BALANCED",
    name: "Balanced",
    nameVietnamese: "Nhà đầu tư Cân Bằng",
    description:
      "Chiến lược cân bằng giữa tăng trưởng và bảo toàn vốn. Phù hợp cho nhà đầu tư muốn tăng trưởng ổn định với rủi ro kiểm soát.",
    allocation: {
      stocks: 40,
      etfs: 10, // ETFs: VFMVN30, FUEVFVND
      bonds: 30,
      cash: 20,
    },
    stopLoss: {
      min: -7,
      max: -10,
      description: "Cắt lỗ ở -7% đến -10% tùy tình huống",
    },
    takeProfit: {
      firstTarget: 15,
      firstTargetPercent: 50, // Sell 50% at +15%
      secondTarget: 30,
      secondTargetPercent: 30, // Sell 30% more at +30%
    },
    focusStocks: ["HPG", "MBB", "MWG", "MSN", "VIC", "FPT", "VCB"], // VN30 & Industry Leaders
    maxPositionSize: 20, // Max 20% NAV per stock
    riskLevel: "MEDIUM",
  };
}

/**
 * Profile C: Aggressive (Tăng Trưởng) - Score 31-40
 */
function getAggressiveProfile(): StrategyProfile {
  return {
    id: "AGGRESSIVE",
    name: "Aggressive",
    nameVietnamese: "Nhà đầu tư Tăng Trưởng",
    description:
      "Chiến lược tập trung vào tăng trưởng mạnh với rủi ro cao. Phù hợp cho nhà đầu tư trẻ, có thời gian dài và chấp nhận biến động.",
    allocation: {
      stocks: 70,
      bonds: 0,
      cash: 20,
      alternatives: 10, // Crypto/Alternative investments
    },
    stopLoss: {
      min: -10,
      max: -15,
      description: "Cắt lỗ linh hoạt ở -10% đến -15%",
    },
    takeProfit: {
      firstTarget: 25,
      firstTargetPercent: 40, // Sell 40% at +25%
      secondTarget: 50,
      secondTargetPercent: 30, // Sell 30% more at +50%
    },
    focusStocks: ["SSI", "VCI", "VIC", "VHM", "FPT", "MWG", "HPG"], // High Beta Stocks
    maxPositionSize: 25, // Max 25% NAV per stock
    riskLevel: "HIGH",
  };
}

/**
 * Get profile color for UI
 */
export function getProfileColor(profile: InvestorProfile): string {
  switch (profile) {
    case "DEFENSIVE":
      return "text-blue-600 dark:text-blue-400";
    case "BALANCED":
      return "text-yellow-600 dark:text-yellow-400";
    case "AGGRESSIVE":
      return "text-red-600 dark:text-red-400";
  }
}

/**
 * Get profile background color for UI
 */
export function getProfileBgColor(profile: InvestorProfile): string {
  switch (profile) {
    case "DEFENSIVE":
      return "bg-blue-500/20 border-blue-500/50";
    case "BALANCED":
      return "bg-yellow-500/20 border-yellow-500/50";
    case "AGGRESSIVE":
      return "bg-red-500/20 border-red-500/50";
  }
}

