import { RETAIL_LEGAL_DISCLAIMER } from "@/lib/compliance/disclaimer";
import type { SupportedCurrency } from "@/lib/currency";
import { toVndEquivalent } from "@/lib/currency";
import { requiredGainToRecover } from "@/lib/quant/recovery";
import { detectMarketRegime, type MarketSignals } from "@/lib/quant/regime-detector";

export type AssetPreference =
  | "stocks"
  | "etf"
  | "bonds"
  | "real_estate"
  | "gold"
  | "commodities"
  | "forex";

export type TimelineHorizon = "short" | "medium" | "long";
export type InvestmentGoal = "accumulate" | "fast_rotation" | "lifestyle_income";
export type BehavioralBias = "panic" | "fomo" | "hold";
export type MarketCheckFrequency = "calm" | "emotional";

export interface BehavioralDnaProfile {
  totalCapital: number;
  currency: SupportedCurrency;
  capitalVnd: number;
  assetPreferences: AssetPreference[];
  timeline: TimelineHorizon;
  goal: InvestmentGoal;
  maxDrawdown: number;
  behavioralBias: BehavioralBias;
  marketCheckFrequency: MarketCheckFrequency;
  userOpenNotes: string;
}

export interface AllocationRow {
  name: string;
  pct: number;
  amount: number;
  color: string;
}

export interface TechnicalLevels {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  ma20: number;
  ma50: number;
  rsi14: number;
  macdSignal: string;
  primaryTicker: string;
}

export interface InvestorGenomeReport {
  profileTitle: string;
  profileDesc: string;
  methodology: "MPT" | "TECHNICAL_SWING";
  regimeDetected: string;
  currency: SupportedCurrency;
  recoveryGainPct: number;
  allocation: AllocationRow[];
  holdings: { ticker: string; weightPct: number; capitalAmount: number }[];
  technicalLevels?: TechnicalLevels;
  behavioralInsights: string[];
  activeAIModes: string[];
  cashBufferPct: number;
  disclaimer: string;
}

const ASSET_META: Record<AssetPreference, { label: string; color: string; baseWeight: number }> = {
  stocks: { label: "Cổ phiếu", color: "#5eb8d9", baseWeight: 22 },
  etf: { label: "Quỹ chỉ số (ETF)", color: "#7c9eb8", baseWeight: 14 },
  bonds: { label: "Trái phiếu", color: "#34d399", baseWeight: 12 },
  real_estate: { label: "Bất động sản", color: "#a78bfa", baseWeight: 10 },
  gold: { label: "Vàng", color: "#fbbf24", baseWeight: 8 },
  commodities: { label: "Hàng hóa / Dầu", color: "#f97316", baseWeight: 8 },
  forex: { label: "Ngoại hối", color: "#94a3b8", baseWeight: 6 },
};

function stressFromProfile(p: BehavioralDnaProfile): number {
  let s = 0;
  if (p.marketCheckFrequency === "emotional") s += 12;
  if (p.behavioralBias === "panic") s += 10;
  if (p.behavioralBias === "fomo") s += 8;
  if (p.goal === "fast_rotation") s += 10;
  if (p.timeline === "short") s += 8;
  if (Math.abs(p.maxDrawdown) <= 10) s += 6;
  if (/nợ|vay|áp lực/i.test(p.userOpenNotes)) s += 8;
  return Math.min(40, s);
}

function buildRegime(): string {
  return detectMarketRegime({
    vnimav_20_deviation: -0.02,
    sbv_net_injection_30d: -12_000_000_000_000,
    fx_usdvnd_ytd_change: 0.035,
    vix_vn: 18,
  } as MarketSignals);
}

function buildAllocationRows(
  prefs: AssetPreference[],
  cap: number,
  stress: number
): { rows: AllocationRow[]; cashPct: number } {
  let cashPct = Math.min(45, 12 + stress);
  const investable = 100 - cashPct;
  const totalBase = prefs.reduce((s, p) => s + ASSET_META[p].baseWeight, 0);
  const rows: AllocationRow[] = prefs.map((p) => {
    const pct = (ASSET_META[p].baseWeight / totalBase) * investable;
    return {
      name: ASSET_META[p].label,
      pct: parseFloat(pct.toFixed(1)),
      amount: Math.round((pct / 100) * cap),
      color: ASSET_META[p].color,
    };
  });
  rows.push({
    name: "Cash Buffer (đệm an toàn)",
    pct: parseFloat(cashPct.toFixed(1)),
    amount: Math.round((cashPct / 100) * cap),
    color: "#52525b",
  });
  return { rows, cashPct };
}

export function buildProfileFromBody(body: Record<string, unknown>): BehavioralDnaProfile | null {
  const totalCapital = Number(body.totalCapital);
  if (!totalCapital || totalCapital <= 0) return null;

  const currency = String(body.currency ?? "VND") as SupportedCurrency;
  const validCurrency = ["VND", "USD", "HKD", "CNY", "SGD", "THB", "EUR", "AUD"].includes(currency)
    ? currency
    : "VND";

  const rawPrefs = Array.isArray(body.assetPreferences) ? body.assetPreferences : [];
  const assetPreferences = rawPrefs.filter((p): p is AssetPreference =>
    Object.keys(ASSET_META).includes(String(p))
  );
  if (assetPreferences.length === 0) return null;

  const timeline = (["short", "medium", "long"].includes(String(body.timeline))
    ? body.timeline
    : "medium") as TimelineHorizon;

  const goal = (["accumulate", "fast_rotation", "lifestyle_income"].includes(String(body.goal))
    ? body.goal
    : "accumulate") as InvestmentGoal;

  let maxDrawdown = Number(body.maxDrawdown ?? -15);
  if (maxDrawdown > 0) maxDrawdown = -maxDrawdown;

  const biasRaw = String(body.behavioralBias ?? "hold");
  const behavioralBias: BehavioralBias =
    biasRaw === "panic" || biasRaw === "fomo" || biasRaw === "hold" ? biasRaw : "hold";

  const freqRaw = String(body.marketCheckFrequency ?? "calm");
  const marketCheckFrequency: MarketCheckFrequency =
    freqRaw === "emotional" ? "emotional" : "calm";

  return {
    totalCapital,
    currency: validCurrency,
    capitalVnd: toVndEquivalent(totalCapital, validCurrency),
    assetPreferences,
    timeline,
    goal,
    maxDrawdown,
    behavioralBias,
    marketCheckFrequency,
    userOpenNotes: String(body.userOpenNotes ?? "").trim(),
  };
}

export function buildFallbackGenome(profile: BehavioralDnaProfile): InvestorGenomeReport {
  const cap = profile.totalCapital;
  const stress = stressFromProfile(profile);
  const regime = buildRegime();
  const recoveryGainPct = requiredGainToRecover(profile.maxDrawdown);

  let extraCash = profile.behavioralBias === "panic" ? 6 : 0;
  const { rows: allocation, cashPct } = buildAllocationRows(
    profile.assetPreferences,
    cap,
    stress + extraCash
  );

  const isTechnical =
    profile.timeline === "short" || profile.goal === "fast_rotation";

  const goalLabels: Record<InvestmentGoal, string> = {
    accumulate: "Tích sản dài hạn — ưu tiên compound interest",
    fast_rotation: "Xoay vốn nhanh — kiểm soát position size chặt",
    lifestyle_income: "Thu nhập trang trải — rút vốn định kỳ có kế hoạch",
  };

  const timelineLabels: Record<TimelineHorizon, string> = {
    short: "Ngắn hạn (<3 tháng)",
    medium: "Trung hạn (3 tháng – 1 năm)",
    long: "Dài hạn (>1 năm)",
  };

  const insights = [
    goalLabels[profile.goal],
    `Khung thời gian: ${timelineLabels[profile.timeline]}`,
    `Mức sụt giảm ${profile.maxDrawdown}% cần lãi +${recoveryGainPct}% để hòa vốn (công thức CFA recovery).`,
    profile.behavioralBias === "panic"
      ? "Loss Aversion cao — tăng cash buffer, tránh bán tháo."
      : profile.behavioralBias === "fomo"
        ? "Overconfidence — giới hạn 20% vốn trên một ý tưởng."
        : "Kỷ luật giữ vị thế — kích hoạt kiểm toán BCTC định kỳ.",
  ];
  if (profile.userOpenNotes.trim()) {
    insights.push(`Bối cảnh cá nhân: "${profile.userOpenNotes.slice(0, 140)}..."`);
  }

  let technicalLevels: TechnicalLevels | undefined;
  if (isTechnical) {
    const entry = profile.currency === "VND" ? 28500 : 28.5;
    technicalLevels = {
      primaryTicker: "HPG",
      entryPrice: entry,
      stopLoss: Math.round(entry * (1 + profile.maxDrawdown / 100)),
      takeProfit: Math.round(entry * (1.1 + Math.abs(profile.maxDrawdown) / 200)),
      ma20: Math.round(entry * 0.97),
      ma50: Math.round(entry * 0.93),
      rsi14: 48,
      macdSignal: "neutral",
    };
    insights.push("Chế độ kỹ thuật: MA / RSI / MACD + SL & TP bắt buộc.");
  }

  const holdings: InvestorGenomeReport["holdings"] = [];
  if (profile.assetPreferences.includes("stocks")) {
    holdings.push({ ticker: "HPG", weightPct: 12, capitalAmount: Math.round(cap * 0.12) });
    holdings.push({ ticker: "FPT", weightPct: 10, capitalAmount: Math.round(cap * 0.1) });
  }
  if (profile.assetPreferences.includes("etf")) {
    holdings.push({ ticker: "E1VFVN30", weightPct: 14, capitalAmount: Math.round(cap * 0.14) });
  }

  return {
    profileTitle: isTechnical
      ? "Investor Genome — HawkEye Technical Overlay"
      : "Investor Genome — Modern Portfolio Theory",
    profileDesc:
      "Phân bổ theo CFA Portfolio Management, ZHFAM/STATORS v5 và hồ sơ hành vi của bạn.",
    methodology: isTechnical ? "TECHNICAL_SWING" : "MPT",
    regimeDetected: regime,
    currency: profile.currency,
    recoveryGainPct,
    allocation,
    holdings,
    technicalLevels,
    behavioralInsights: insights,
    activeAIModes: [
      "HawkEye AI Guard Monitor — ACTIVE",
      "HawkEye AI Core allocation engine",
      profile.assetPreferences.includes("bonds") ? "Bond sleeve ON" : "Bonds excluded — cash động",
    ],
    cashBufferPct: cashPct,
    disclaimer: RETAIL_LEGAL_DISCLAIMER,
  };
}

export function parseGenomeFromAi(raw: string, profile: BehavioralDnaProfile): InvestorGenomeReport | null {
  try {
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const p = JSON.parse(clean);
    if (!Array.isArray(p.allocation)) return null;

    const cap = profile.totalCapital;
    const allocation: AllocationRow[] = p.allocation.map(
      (a: { name: string; pct: number; color?: string }) => ({
        name: a.name,
        pct: Number(a.pct),
        amount: Math.round((Number(a.pct) / 100) * cap),
        color: a.color || "#52525b",
      })
    );

    return {
      profileTitle: p.profileTitle || "Investor Genome Report",
      profileDesc: p.profileDesc || "",
      methodology: p.methodology === "TECHNICAL_SWING" ? "TECHNICAL_SWING" : "MPT",
      regimeDetected: p.regimeDetected || "RISK_ON",
      currency: profile.currency,
      recoveryGainPct: requiredGainToRecover(profile.maxDrawdown),
      allocation,
      holdings: Array.isArray(p.holdings) ? p.holdings : [],
      technicalLevels: p.technicalLevels,
      behavioralInsights: Array.isArray(p.behavioralInsights) ? p.behavioralInsights : [],
      activeAIModes: Array.isArray(p.activeAIModes)
        ? p.activeAIModes.map((m: string) => m.replace(/gemini|google/gi, "HawkEye AI"))
        : ["HawkEye AI Core"],
      cashBufferPct: Number(p.cashBufferPct) || 0,
      disclaimer: RETAIL_LEGAL_DISCLAIMER,
    };
  } catch {
    return null;
  }
}
