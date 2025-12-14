export interface DealDigestCard {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCap: string;
  riskScore: number;
  signal: "Buy" | "Hold" | "Sell";
  summary: string;
  publishedAt: string;
}

export const mockDealDigests: DealDigestCard[] = [
  {
    id: "1",
    ticker: "HPG",
    companyName: "CTCP Tập đoàn Hòa Phát",
    sector: "Steel",
    industry: "Steel Production",
    marketCap: "Large (20,000 - 50,000 tỷ VND)",
    riskScore: 5,
    signal: "Buy",
    summary: "Lãnh đạo thị trường thép với thị phần 30%. Dự án Dung Quất 2 hoàn thành 80%, dự kiến vận hành Q1/2025.",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    ticker: "FPT",
    companyName: "CTCP FPT",
    sector: "Technology",
    industry: "Technology Services",
    marketCap: "Large (50,000+ tỷ VND)",
    riskScore: 4,
    signal: "Hold",
    summary: "Mảng AI và Cloud tăng trưởng 35%, hợp đồng chip bán dẫn với NVIDIA. Tăng trưởng ổn định 15-20% mỗi năm.",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    ticker: "MWG",
    companyName: "CTCP Đầu tư Thế Giới Di Động",
    sector: "Retail",
    industry: "Retail",
    marketCap: "Large (30,000 - 50,000 tỷ VND)",
    riskScore: 5,
    signal: "Buy",
    summary: "Bách Hóa Xanh đạt điểm hòa vốn, biên lợi nhuận cải thiện. Mở rộng chuỗi cửa hàng tăng thị phần.",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    ticker: "VCB",
    companyName: "Ngân hàng TMCP Ngoại Thương Việt Nam",
    sector: "Banking",
    industry: "Banking",
    marketCap: "Large (100,000+ tỷ VND)",
    riskScore: 3,
    signal: "Hold",
    summary: "Ngân hàng hàng đầu với tỷ lệ NPL thấp và ROE cao. Chuyển đổi số mạnh mẽ, tăng hiệu quả hoạt động.",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    ticker: "VHM",
    companyName: "CTCP Vinhomes",
    sector: "Real Estate",
    industry: "Real Estate Development",
    marketCap: "Large (100,000+ tỷ VND)",
    riskScore: 6,
    signal: "Hold",
    summary: "Thị trường bất động sản có dấu hiệu phục hồi. Dự án Vinhomes Grand Park và Ocean Park tiếp tục bán tốt.",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "6",
    ticker: "MSN",
    companyName: "CTCP Tập đoàn Masan",
    sector: "Consumer Goods",
    industry: "Consumer Goods",
    marketCap: "Large (50,000+ tỷ VND)",
    riskScore: 7,
    signal: "Hold",
    summary: "Mở rộng mạng lưới WinMart/WinMart+, tăng thị phần bán lẻ. Chiến lược đa ngành tạo hiệu ứng cộng hưởng.",
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "7",
    ticker: "STB",
    companyName: "Ngân hàng TMCP Sài Gòn Thương Tín",
    sector: "Banking",
    industry: "Banking",
    marketCap: "Medium (10,000 - 30,000 tỷ VND)",
    riskScore: 4,
    signal: "Hold",
    summary: "Tăng trưởng tín dụng ổn định, chất lượng tài sản cải thiện. Chuyển đổi số, nâng cấp hệ thống ngân hàng số.",
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
  },
];

