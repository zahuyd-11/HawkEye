/** HawkEye Intelligence Risk Desk — VN30 periodic CFA-style reports (freemium) */
export interface RiskDeskReport {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  riskScore: number;
  signal: "Buy" | "Hold" | "Sell";
  summary: string;
  publishedAt: string;
  reportTier: "free" | "premium";
  metrics: { label: string; value: string }[];
  chartHint: string;
}

export const VN30_RISK_DESK_REPORTS: RiskDeskReport[] = [
  {
    id: "hpg",
    ticker: "HPG",
    companyName: "Tập đoàn Hòa Phát",
    sector: "Thép",
    riskScore: 5,
    signal: "Hold",
    summary: "Chu kỳ thép phục hồi có kiểm soát — theo dõi biên lợi nhuận và tỷ giá.",
    publishedAt: new Date().toISOString(),
    reportTier: "free",
    metrics: [
      { label: "P/E", value: "12.4x" },
      { label: "ROE", value: "12.8%" },
      { label: "Nợ/Vốn", value: "1.84x" },
    ],
    chartHint: "Doanh thu & EBIT 5 năm — xu hướng hồi phục",
  },
  {
    id: "fpt",
    ticker: "FPT",
    companyName: "Công ty Cổ phần FPT",
    sector: "Công nghệ",
    riskScore: 4,
    signal: "Buy",
    summary: "Mảng AI/Cloud tăng trưởng kép — chất lượng dòng tiền tốt hơn trung vị ngành.",
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reportTier: "free",
    metrics: [
      { label: "P/E", value: "18.2x" },
      { label: "ROE", value: "24.5%" },
      { label: "FCF yield", value: "3.1%" },
    ],
    chartHint: "Segment tech vs telco — đóng góp lợi nhuận",
  },
  {
    id: "dgw",
    ticker: "DGW",
    companyName: "Công ty Cổ phần Digiworld",
    sector: "Phân phối CN",
    riskScore: 5,
    signal: "Hold",
    summary:
      "Mobile 52% doanh thu — DCF 5 năm theo segment, biên gộp cải thiện QoQ.",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    reportTier: "free",
    metrics: [
      { label: "P/E", value: "14.5x" },
      { label: "GM", value: "9.8%" },
      { label: "CAGR DT", value: "14.5%" },
    ],
    chartHint: "Mobile / Laptop / Office equipment mix",
  },
  {
    id: "vcb",
    ticker: "VCB",
    companyName: "Vietcombank",
    sector: "Ngân hàng",
    riskScore: 3,
    signal: "Hold",
    summary: "NPL thấp, ROE ổn định — rủi ro tín dụng vĩ mô cần theo dõi.",
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    reportTier: "free",
    metrics: [
      { label: "P/B", value: "2.1x" },
      { label: "ROE", value: "22%" },
      { label: "NPL", value: "0.9%" },
    ],
    chartHint: "Tín dụng vs huy động — margin ổn định",
  },
];
