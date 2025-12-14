/**
 * Pricing Features Data
 * Centralized data for pricing tiers and feature comparison
 */

export type Tier = "FREE" | "MINI" | "PLUS" | "PRO";

export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
}

export interface TierFeature {
  tier: Tier;
  value: string | boolean;
  highlight?: boolean; // For highlighting special features
}

export interface FeatureRow {
  feature: PricingFeature;
  tiers: {
    FREE: TierFeature;
    MINI: TierFeature;
    PLUS: TierFeature;
    PRO: TierFeature;
  };
}

export const pricingFeatures: FeatureRow[] = [
  {
    feature: {
      id: "realtime-data",
      name: "Dữ liệu Real-time",
      description: "Dữ liệu thị trường cập nhật theo thời gian thực",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: false },
      PLUS: { tier: "PLUS", value: true },
      PRO: { tier: "PRO", value: true },
    },
  },
  {
    feature: {
      id: "deal-digest",
      name: "Báo cáo DealDigest",
      description: "Số lượng báo cáo phân tích công ty mỗi tháng",
    },
    tiers: {
      FREE: { tier: "FREE", value: "1 mã/tháng" },
      MINI: { tier: "MINI", value: "5 mã/tháng" },
      PLUS: { tier: "PLUS", value: "Không giới hạn", highlight: true },
      PRO: { tier: "PRO", value: "Không giới hạn", highlight: true },
    },
  },
  {
    feature: {
      id: "ai-tradeplan",
      name: "AI TradePlan",
      description: "Tính năng lập kế hoạch giao dịch với AI",
    },
    tiers: {
      FREE: { tier: "FREE", value: "Cơ bản" },
      MINI: { tier: "MINI", value: "Cơ bản" },
      PLUS: { tier: "PLUS", value: "Nâng cao", highlight: true },
      PRO: { tier: "PRO", value: "Nâng cao", highlight: true },
    },
  },
  {
    feature: {
      id: "macro-data",
      name: "Dữ liệu Vĩ mô",
      description: "Dữ liệu kinh tế vĩ mô và chỉ số thị trường",
    },
    tiers: {
      FREE: { tier: "FREE", value: "Trễ 15 phút" },
      MINI: { tier: "MINI", value: "Real-time" },
      PLUS: { tier: "PLUS", value: "Real-time", highlight: true },
      PRO: { tier: "PRO", value: "Real-time + Bloomberg Data", highlight: true },
    },
  },
  {
    feature: {
      id: "micro-research",
      name: "Micro Research",
      description: "Truy cập thư viện nghiên cứu vi mô",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: "Giới hạn" },
      PLUS: { tier: "PLUS", value: "Đầy đủ", highlight: true },
      PRO: { tier: "PRO", value: "Đầy đủ + Yêu cầu tùy chỉnh", highlight: true },
    },
  },
  {
    feature: {
      id: "risk-alerts",
      name: "Cảnh báo Rủi ro",
      description: "Thông báo tự động về thay đổi rủi ro",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: true },
      PLUS: { tier: "PLUS", value: true },
      PRO: { tier: "PRO", value: true },
    },
  },
  {
    feature: {
      id: "one-on-one-support",
      name: "Hỗ trợ 1-1",
      description: "Hỗ trợ trực tiếp từ chuyên gia",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: false },
      PLUS: { tier: "PLUS", value: false },
      PRO: { tier: "PRO", value: true, highlight: true },
    },
  },
  {
    feature: {
      id: "priority-support",
      name: "Hỗ trợ Ưu tiên",
      description: "Phản hồi nhanh từ đội ngũ hỗ trợ",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: false },
      PLUS: { tier: "PLUS", value: false },
      PRO: { tier: "PRO", value: true, highlight: true },
    },
  },
  {
    feature: {
      id: "derivatives-etf",
      name: "Phái sinh & ETF",
      description: "Phân tích và dữ liệu về phái sinh và ETF",
    },
    tiers: {
      FREE: { tier: "FREE", value: false },
      MINI: { tier: "MINI", value: false },
      PLUS: { tier: "PLUS", value: false },
      PRO: { tier: "PRO", value: true, highlight: true },
    },
  },
];

export const tierNames: Record<Tier, string> = {
  FREE: "Free",
  MINI: "Mini",
  PLUS: "Plus",
  PRO: "Pro",
};

export const tierPrices: Record<Tier, { monthly: string; yearly?: string }> = {
  FREE: { monthly: "0₫" },
  MINI: { monthly: "99,000₫" },
  PLUS: { monthly: "249,000₫" },
  PRO: { monthly: "499,000₫" },
};

