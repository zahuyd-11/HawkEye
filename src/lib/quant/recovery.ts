/** CFA-style capital recovery after drawdown: Required Gain % = (1/(1-|d|)) - 1 */
export function requiredGainToRecover(drawdownPct: number): number {
  const d = Math.abs(drawdownPct) / 100;
  if (d <= 0) return 0;
  if (d >= 0.99) return 999;
  return parseFloat((((1 / (1 - d)) - 1) * 100).toFixed(1));
}

export const DRAWDOWN_GUIDE = [
  { pct: -5, label: "Bảo thủ", note: "Phù hợp danh mục phòng thủ" },
  { pct: -10, label: "Cân bằng", note: "Đề xuất F0 đa số" },
  { pct: -15, label: "Chủ động", note: "Cần kỷ luật cắt lỗ" },
  { pct: -25, label: "Tích cực", note: "Chỉ khi có kinh nghiệm" },
  { pct: -40, label: "Tối đa", note: "Không khuyến nghị vượt mức này" },
] as const;

export function suggestDrawdown(goal: string, timeline: string): number {
  if (goal === "fast_rotation" || timeline === "short") return -12;
  if (goal === "lifestyle_income") return -10;
  if (timeline === "long") return -18;
  return -15;
}
