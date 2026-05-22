export type SupportedCurrency = "VND" | "USD" | "HKD" | "CNY" | "SGD" | "THB" | "EUR" | "AUD";

export const CURRENCIES: {
  code: SupportedCurrency;
  symbol: string;
  label: string;
  locale: string;
  rateToVnd: number;
}[] = [
  { code: "VND", symbol: "₫", label: "Việt Nam (VND)", locale: "vi-VN", rateToVnd: 1 },
  { code: "USD", symbol: "$", label: "Mỹ (USD)", locale: "en-US", rateToVnd: 25_400 },
  { code: "HKD", symbol: "HK$", label: "Hong Kong (HKD)", locale: "en-HK", rateToVnd: 3_250 },
  { code: "CNY", symbol: "¥", label: "Trung Quốc (CNY)", locale: "zh-CN", rateToVnd: 3_500 },
  { code: "SGD", symbol: "S$", label: "Singapore (SGD)", locale: "en-SG", rateToVnd: 18_900 },
  { code: "THB", symbol: "฿", label: "Thái Lan (THB)", locale: "th-TH", rateToVnd: 720 },
  { code: "EUR", symbol: "€", label: "Châu Âu (EUR)", locale: "de-DE", rateToVnd: 27_600 },
  { code: "AUD", symbol: "A$", label: "Úc (AUD)", locale: "en-AU", rateToVnd: 16_800 },
];

export function getCurrencyMeta(code: SupportedCurrency) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function parseCapitalInput(val: string): number {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

export function formatCapitalInput(raw: string): string {
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const meta = getCurrencyMeta(currency);
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(amount);
}

export function toVndEquivalent(amount: number, currency: SupportedCurrency): number {
  return Math.round(amount * getCurrencyMeta(currency).rateToVnd);
}
