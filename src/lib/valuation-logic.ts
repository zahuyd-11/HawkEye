/**
 * Enhanced Valuation Logic for DealDigest
 * Supports both P/E and P/B valuation methods with industry peer comparison
 */

export interface PeerData {
  ticker: string;
  pe?: number;
  pb?: number;
}

export interface CompanyMetrics {
  eps: number; // Earnings Per Share
  pe?: number; // Current P/E ratio
  pb?: number; // Current P/B ratio
  bvps: number; // Book Value Per Share
}

export interface ValuationInput {
  ticker: string;
  currentPrice: number;
  metrics: CompanyMetrics;
  peers: PeerData[];
  industry?: string; // Optional: for industry-specific logic
}

export interface ValuationResult {
  industryAvgPE: number;
  industryAvgPB: number;
  fairValuePE: number;
  fairValuePB: number;
  compositeFairValue: number;
  upsidePercentage: number;
  verdict: "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";
  recommendation: string; // Vietnamese recommendation
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

/**
 * Calculate average P/E from peers (excluding outliers)
 */
function calculateAveragePE(peers: PeerData[]): number {
  const validPEs = peers
    .map((p) => p.pe)
    .filter((pe): pe is number => typeof pe === "number" && pe > 0 && pe < 100);

  if (validPEs.length === 0) return 0;

  // Remove outliers (values more than 2 standard deviations from mean)
  const mean = validPEs.reduce((a, b) => a + b, 0) / validPEs.length;
  const variance = validPEs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validPEs.length;
  const stdDev = Math.sqrt(variance);

  const filtered = validPEs.filter((pe) => Math.abs(pe - mean) <= 2 * stdDev);

  return filtered.length > 0
    ? filtered.reduce((a, b) => a + b, 0) / filtered.length
    : mean;
}

/**
 * Calculate average P/B from peers (excluding outliers)
 */
function calculateAveragePB(peers: PeerData[]): number {
  const validPBs = peers
    .map((p) => p.pb)
    .filter((pb): pb is number => typeof pb === "number" && pb > 0 && pb < 10);

  if (validPBs.length === 0) return 0;

  // Remove outliers
  const mean = validPBs.reduce((a, b) => a + b, 0) / validPBs.length;
  const variance = validPBs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validPBs.length;
  const stdDev = Math.sqrt(variance);

  const filtered = validPBs.filter((pb) => Math.abs(pb - mean) <= 2 * stdDev);

  return filtered.length > 0
    ? filtered.reduce((a, b) => a + b, 0) / filtered.length
    : mean;
}

/**
 * Determine verdict based on upside percentage
 */
function determineVerdict(upsidePercentage: number): {
  verdict: ValuationResult["verdict"];
  recommendation: string;
} {
  if (upsidePercentage >= 30) {
    return {
      verdict: "STRONG_BUY",
      recommendation: "MUA MẠNH",
    };
  } else if (upsidePercentage >= 15) {
    return {
      verdict: "BUY",
      recommendation: "MUA",
    };
  } else if (upsidePercentage >= -5) {
    return {
      verdict: "HOLD",
      recommendation: "NẮM GIỮ",
    };
  } else if (upsidePercentage >= -15) {
    return {
      verdict: "SELL",
      recommendation: "BÁN",
    };
  } else {
    return {
      verdict: "STRONG_SELL",
      recommendation: "BÁN MẠNH",
    };
  }
}

/**
 * Main valuation calculation function
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const { currentPrice, metrics, peers } = input;

  // Calculate industry averages
  const industryAvgPE = calculateAveragePE(peers);
  const industryAvgPB = calculateAveragePB(peers);

  // Calculate fair values
  const fairValuePE = metrics.eps * industryAvgPE;
  const fairValuePB = metrics.bvps * industryAvgPB;

  // Composite fair value (average of both methods)
  // For some industries, we might weight one method more, but default is 50/50
  const compositeFairValue = (fairValuePE + fairValuePB) / 2;

  // Calculate upside percentage
  const upsidePercentage = ((compositeFairValue - currentPrice) / currentPrice) * 100;

  // Determine verdict
  const { verdict, recommendation } = determineVerdict(upsidePercentage);

  // Determine risk level (simplified - can be enhanced with more factors)
  const riskLevel: ValuationResult["riskLevel"] =
    Math.abs(upsidePercentage) < 10 ? "MEDIUM" : upsidePercentage > 0 ? "LOW" : "HIGH";

  return {
    industryAvgPE,
    industryAvgPB,
    fairValuePE,
    fairValuePB,
    compositeFairValue,
    upsidePercentage,
    verdict,
    recommendation,
    riskLevel,
  };
}

/**
 * Format price for display (Vietnamese format)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

