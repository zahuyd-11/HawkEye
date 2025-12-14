/**
 * Multi-Company Mock Data for DealDigest
 * Supports dynamic stock lookup by ticker
 */

import { ValuationInput } from "@/lib/valuation-logic";

export interface StockData extends ValuationInput {
  id: string; // Ticker (e.g., "FPT")
  name: string;
  industry: string;
  marketCap: string;
  industryAvgPe: number; // Top 5 average
  fairValue: number;
  verdict: "MUA" | "NẮM GIỮ" | "BÁN";
  catalysts: string[];
  risks: string[];
  financialHealth: {
    debtToEquity: number;
    quickRatio: number;
    roe: number;
    currentRatio: number;
  };
  projects: Array<{
    name: string;
    description: string;
    progress: string;
    impact: string;
  }>;
  checklist: Array<{
    condition: string;
    action: string;
  }>;
  hawkeyeScore: number;
  valuationHistory: Array<{
    period: string;
    pe: number;
    pb: number;
  }>;
}

// HPG - Hoa Phat Group
const hpgData: StockData = {
  id: "HPG",
  ticker: "HPG",
  name: "CTCP Tập đoàn Hòa Phát",
  industry: "Steel Production",
  sector: "Steel",
  marketCap: "Large (20,000 - 50,000 tỷ VND)",
  currentPrice: 28500,
  metrics: {
    eps: 1800,
    pe: 15.8,
    pb: 1.6,
    bvps: 17800,
  },
  peers: [
    { ticker: "HSG", pe: 14.2, pb: 1.4 },
    { ticker: "NKG", pe: 16.5, pb: 1.5 },
    { ticker: "POM", pe: 20.0, pb: 0.9 },
    { ticker: "TVN", pe: 13.5, pb: 1.3 },
    { ticker: "SMC", pe: 18.2, pb: 1.7 },
  ],
  industryAvgPe: 16.4,
  fairValue: 34200,
  verdict: "MUA",
  catalysts: [
    "Dự án Dung Quất 2 hoàn thành 80%, dự kiến vận hành Q1/2025, tăng công suất thép 30%.",
    "Giá thép HRC thế giới phục hồi 15% từ đáy, hỗ trợ biên lợi nhuận.",
    "Thị trường bất động sản trong nước có dấu hiệu phục hồi, tăng nhu cầu thép xây dựng.",
  ],
  risks: [
    "Áp lực tỷ giá USD/VND làm tăng chi phí nguyên liệu nhập khẩu.",
    "Thị trường bất động sản trong nước phục hồi chậm hơn kỳ vọng.",
    "Biến động giá nguyên liệu (quặng sắt, than cốc) ảnh hưởng đến chi phí sản xuất.",
  ],
  financialHealth: {
    debtToEquity: 0.65,
    quickRatio: 1.2,
    roe: 18.5,
    currentRatio: 1.5,
  },
  projects: [
    {
      name: "Dự án Dung Quất 2",
      description: "Nhà máy thép mới tại Khu kinh tế Dung Quất với công suất 5 triệu tấn/năm.",
      progress: "80% hoàn thành",
      impact: "Tăng tổng công suất sản xuất thép của HPG lên 30%, mở rộng thị phần và tăng doanh thu dự kiến 15-20% từ năm 2025.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 26,000 VND", action: "MUA MẠNH - Cơ hội tích lũy tốt" },
    { condition: "Nếu giá thép HRC thế giới giảm dưới $500/tấn", action: "XEM XÉT LẠI - Rủi ro biên lợi nhuận" },
  ],
  hawkeyeScore: 7.5,
  valuationHistory: [
    { period: "2022", pe: 5.5, pb: 1.1 },
    { period: "2023", pe: 25.1, pb: 1.6 },
    { period: "Q1-2024", pe: 18.2, pb: 1.7 },
    { period: "Current", pe: 15.8, pb: 1.6 },
  ],
};

// FPT - FPT Corporation
const fptData: StockData = {
  id: "FPT",
  ticker: "FPT",
  name: "CTCP FPT",
  industry: "Technology Services",
  sector: "Technology",
  marketCap: "Large (50,000+ tỷ VND)",
  currentPrice: 125000,
  metrics: {
    eps: 6250,
    pe: 20.0,
    pb: 4.2,
    bvps: 29760,
  },
  peers: [
    { ticker: "CMG", pe: 18.5, pb: 3.8 },
    { ticker: "ELC", pe: 19.2, pb: 4.0 },
    { ticker: "ITD", pe: 17.8, pb: 3.5 },
    { ticker: "VTI", pe: 16.5, pb: 3.2 },
    { ticker: "TMA", pe: 18.0, pb: 3.9 },
  ],
  industryAvgPe: 18.0,
  fairValue: 112500,
  verdict: "NẮM GIỮ",
  catalysts: [
    "Mảng AI và Cloud tăng trưởng 35% YoY, hợp đồng chip bán dẫn với NVIDIA mở rộng thị trường công nghệ cao.",
    "Hợp đồng outsourcing lớn từ thị trường Nhật Bản, tăng trưởng ổn định 15-20% mỗi năm.",
    "Mảng giáo dục FPT Education mở rộng, tăng doanh thu đa dạng hóa.",
    "Chuyển đổi số trong nước tăng tốc, nhu cầu dịch vụ CNTT tăng mạnh.",
  ],
  risks: [
    "Phụ thuộc vào một số khách hàng lớn, cần theo dõi hợp đồng mới.",
    "Cạnh tranh từ các công ty công nghệ quốc tế.",
    "Biến động tỷ giá ảnh hưởng đến doanh thu outsourcing.",
  ],
  financialHealth: {
    debtToEquity: 0.3,
    quickRatio: 1.8,
    roe: 22.0,
    currentRatio: 2.0,
  },
  projects: [
    {
      name: "Mở rộng thị trường Nhật Bản",
      description: "Tăng cường hợp tác với các doanh nghiệp Nhật Bản trong lĩnh vực outsourcing.",
      progress: "Đang triển khai",
      impact: "Dự kiến tăng doanh thu 20-25% từ thị trường Nhật Bản trong 2-3 năm tới.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 110,000 VND", action: "MUA - Cơ hội tích lũy" },
    { condition: "Nếu hợp đồng lớn bị hủy", action: "XEM XÉT LẠI - Rủi ro doanh thu" },
  ],
  hawkeyeScore: 7.0,
  valuationHistory: [
    { period: "2022", pe: 18.5, pb: 3.8 },
    { period: "2023", pe: 19.2, pb: 4.0 },
    { period: "Q1-2024", pe: 19.8, pb: 4.1 },
    { period: "Current", pe: 20.0, pb: 4.2 },
  ],
};

// MWG - Mobile World Group
const mwgData: StockData = {
  id: "MWG",
  ticker: "MWG",
  name: "CTCP Đầu tư Thế Giới Di Động",
  industry: "Retail",
  sector: "Consumer Discretionary",
  marketCap: "Large (30,000 - 50,000 tỷ VND)",
  currentPrice: 68000,
  metrics: {
    eps: 4533,
    pe: 15.0,
    pb: 2.8,
    bvps: 24286,
  },
  peers: [
    { ticker: "DGW", pe: 14.5, pb: 2.5 },
    { ticker: "FRT", pe: 16.2, pb: 3.0 },
    { ticker: "PET", pe: 15.8, pb: 2.7 },
    { ticker: "PNJ", pe: 17.0, pb: 3.2 },
    { ticker: "VRE", pe: 14.8, pb: 2.6 },
  ],
  industryAvgPe: 15.7,
  fairValue: 78000,
  verdict: "MUA",
  catalysts: [
    "Bách Hóa Xanh đạt điểm hòa vốn, biên lợi nhuận cải thiện từ -5% lên +2%, dự kiến lợi nhuận dương từ Q2/2025.",
    "Mở rộng chuỗi cửa hàng Bach Hoa Xanh, tăng thị phần bán lẻ thực phẩm.",
    "Tăng trưởng mạnh mảng điện thoại và điện tử tiêu dùng.",
    "Chiến lược đa kênh (online + offline) tăng hiệu quả bán hàng.",
  ],
  risks: [
    "Cạnh tranh gay gắt từ các chuỗi bán lẻ khác.",
    "Áp lực biên lợi nhuận do chi phí vận hành tăng.",
    "Phụ thuộc vào chu kỳ tiêu dùng và sức mua của người dân.",
  ],
  financialHealth: {
    debtToEquity: 0.5,
    quickRatio: 0.9,
    roe: 18.0,
    currentRatio: 1.1,
  },
  projects: [
    {
      name: "Mở rộng Bach Hoa Xanh",
      description: "Mở thêm 500 cửa hàng Bach Hoa Xanh trong 2 năm tới.",
      progress: "Đang triển khai",
      impact: "Tăng doanh thu 30-40% từ mảng bán lẻ thực phẩm, mở rộng thị phần.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 60,000 VND", action: "MUA MẠNH - Cơ hội tốt" },
    { condition: "Nếu doanh số Bach Hoa Xanh giảm", action: "XEM XÉT LẠI - Rủi ro tăng trưởng" },
  ],
  hawkeyeScore: 7.8,
  valuationHistory: [
    { period: "2022", pe: 12.5, pb: 2.2 },
    { period: "2023", pe: 14.8, pb: 2.5 },
    { period: "Q1-2024", pe: 14.5, pb: 2.7 },
    { period: "Current", pe: 15.0, pb: 2.8 },
  ],
};

// VCB - Vietcombank
const vcbData: StockData = {
  id: "VCB",
  ticker: "VCB",
  name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
  industry: "Banking",
  sector: "Financial Services",
  marketCap: "Large (100,000+ tỷ VND)",
  currentPrice: 95000,
  metrics: {
    eps: 7917,
    pe: 12.0,
    pb: 1.8,
    bvps: 52778,
  },
  peers: [
    { ticker: "BID", pe: 11.5, pb: 1.6 },
    { ticker: "CTG", pe: 12.5, pb: 1.9 },
    { ticker: "MBB", pe: 11.8, pb: 1.7 },
    { ticker: "TCB", pe: 12.2, pb: 1.8 },
    { ticker: "VPB", pe: 13.0, pb: 2.0 },
  ],
  industryAvgPe: 12.2,
  fairValue: 96500,
  verdict: "NẮM GIỮ",
  catalysts: [
    "Lãi suất ổn định, tăng trưởng tín dụng bền vững.",
    "Chuyển đổi số mạnh mẽ, tăng hiệu quả hoạt động.",
    "Chất lượng tài sản tốt, tỷ lệ nợ xấu thấp.",
  ],
  risks: [
    "Áp lực từ chính sách tiền tệ của Ngân hàng Nhà nước.",
    "Cạnh tranh từ các ngân hàng số và fintech.",
    "Rủi ro tín dụng trong bối cảnh kinh tế biến động.",
  ],
  financialHealth: {
    debtToEquity: 8.5, // Normal for banks
    quickRatio: 0.15, // Normal for banks
    roe: 20.5,
    currentRatio: 0.12, // Normal for banks
  },
  projects: [
    {
      name: "Chuyển đổi số toàn diện",
      description: "Đầu tư mạnh vào công nghệ, nâng cấp hệ thống ngân hàng số.",
      progress: "Đang triển khai",
      impact: "Tăng hiệu quả hoạt động, giảm chi phí, cải thiện trải nghiệm khách hàng.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 85,000 VND", action: "MUA - Cơ hội tích lũy" },
    { condition: "Nếu tỷ lệ nợ xấu tăng trên 2%", action: "THẬN TRỌNG - Rủi ro tín dụng" },
  ],
  hawkeyeScore: 8.0,
  valuationHistory: [
    { period: "2022", pe: 14.2, pb: 1.8 },
    { period: "2023", pe: 15.5, pb: 2.0 },
    { period: "Q1-2024", pe: 15.8, pb: 2.1 },
    { period: "Current", pe: 16.0, pb: 2.2 },
  ],
};

// VHM - Vinhomes
const vhmData: StockData = {
  id: "VHM",
  ticker: "VHM",
  name: "CTCP Vinhomes",
  industry: "Real Estate Development",
  sector: "Real Estate",
  marketCap: "Large (100,000+ tỷ VND)",
  currentPrice: 72000,
  metrics: {
    eps: 4800,
    pe: 15.0,
    pb: 2.5,
    bvps: 28800,
  },
  peers: [
    { ticker: "VIC", pe: 14.5, pb: 2.3 },
    { ticker: "DXG", pe: 16.0, pb: 2.8 },
    { ticker: "NVL", pe: 15.5, pb: 2.6 },
    { ticker: "KDH", pe: 14.8, pb: 2.4 },
    { ticker: "HDG", pe: 15.2, pb: 2.7 },
  ],
  industryAvgPe: 15.2,
  fairValue: 73000,
  verdict: "NẮM GIỮ",
  catalysts: [
    "Thị trường bất động sản có dấu hiệu phục hồi, nhu cầu nhà ở tăng.",
    "Dự án Vinhomes Grand Park và Vinhomes Ocean Park tiếp tục bán tốt.",
    "Dòng tiền cải thiện, giảm áp lực nợ.",
  ],
  risks: [
    "Phụ thuộc vào chu kỳ bất động sản, biến động theo chính sách nhà nước.",
    "Áp lực thanh khoản từ các dự án lớn.",
    "Cạnh tranh từ các chủ đầu tư khác.",
  ],
  financialHealth: {
    debtToEquity: 1.2,
    quickRatio: 0.6,
    roe: 16.5,
    currentRatio: 1.0,
  },
  projects: [
    {
      name: "Vinhomes Grand Park Phase 2",
      description: "Tiếp tục phát triển dự án Vinhomes Grand Park với quy mô lớn.",
      progress: "Đang triển khai",
      impact: "Tăng doanh thu và lợi nhuận trong 2-3 năm tới, củng cố vị thế dẫn đầu thị trường.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 65,000 VND", action: "MUA - Cơ hội tích lũy" },
    { condition: "Nếu chính sách bất động sản thắt chặt", action: "THẬN TRỌNG - Rủi ro chính sách" },
  ],
  hawkeyeScore: 7.2,
  valuationHistory: [
    { period: "2022", pe: 13.5, pb: 2.2 },
    { period: "2023", pe: 14.8, pb: 2.4 },
    { period: "Q1-2024", pe: 14.9, pb: 2.5 },
    { period: "Current", pe: 15.0, pb: 2.5 },
  ],
};

// MSN - Masan Group
const msnData: StockData = {
  id: "MSN",
  ticker: "MSN",
  name: "CTCP Tập đoàn Masan",
  industry: "Consumer Goods",
  sector: "Consumer Staples",
  marketCap: "Large (50,000+ tỷ VND)",
  currentPrice: 85000,
  metrics: {
    eps: 5667,
    pe: 15.0,
    pb: 2.2,
    bvps: 38636,
  },
  peers: [
    { ticker: "VNM", pe: 16.5, pb: 2.5 },
    { ticker: "QNS", pe: 14.8, pb: 2.1 },
    { ticker: "SAB", pe: 17.2, pb: 2.8 },
    { ticker: "VHC", pe: 15.5, pb: 2.3 },
    { ticker: "BCG", pe: 14.5, pb: 2.0 },
  ],
  industryAvgPe: 15.7,
  fairValue: 89000,
  verdict: "NẮM GIỮ",
  catalysts: [
    "Mở rộng mạng lưới WinMart/WinMart+, tăng thị phần bán lẻ.",
    "Tăng trưởng mạnh mảng thực phẩm chế biến và nước giải khát.",
    "Chiến lược đa ngành (Retail + FMCG) tạo hiệu ứng cộng hưởng.",
  ],
  risks: [
    "Cạnh tranh gay gắt trong ngành bán lẻ và FMCG.",
    "Áp lực biên lợi nhuận từ chi phí vận hành và marketing.",
    "Phụ thuộc vào sức mua của người tiêu dùng.",
  ],
  financialHealth: {
    debtToEquity: 0.7,
    quickRatio: 0.8,
    roe: 14.5,
    currentRatio: 1.0,
  },
  projects: [
    {
      name: "Mở rộng WinMart+",
      description: "Mở thêm 200 cửa hàng WinMart+ trong năm 2025, tập trung vào các thành phố lớn.",
      progress: "Đang triển khai",
      impact: "Tăng doanh thu bán lẻ 25-30%, mở rộng thị phần và tăng khả năng tiếp cận khách hàng.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 75,000 VND", action: "MUA - Cơ hội tích lũy" },
    { condition: "Nếu doanh số WinMart+ giảm", action: "XEM XÉT LẠI - Rủi ro tăng trưởng" },
  ],
  hawkeyeScore: 7.3,
  valuationHistory: [
    { period: "2022", pe: 13.8, pb: 2.0 },
    { period: "2023", pe: 14.5, pb: 2.1 },
    { period: "Q1-2024", pe: 14.8, pb: 2.15 },
    { period: "Current", pe: 15.0, pb: 2.2 },
  ],
};

// STB - Sacombank
const stbData: StockData = {
  id: "STB",
  ticker: "STB",
  name: "Ngân hàng TMCP Sài Gòn Thương Tín",
  industry: "Banking",
  sector: "Financial Services",
  marketCap: "Medium (10,000 - 30,000 tỷ VND)",
  currentPrice: 28500,
  metrics: {
    eps: 2375,
    pe: 12.0,
    pb: 1.5,
    bvps: 19000,
  },
  peers: [
    { ticker: "VCB", pe: 12.0, pb: 1.8 },
    { ticker: "BID", pe: 11.5, pb: 1.6 },
    { ticker: "CTG", pe: 12.5, pb: 1.9 },
    { ticker: "MBB", pe: 11.8, pb: 1.7 },
    { ticker: "TPB", pe: 12.3, pb: 1.6 },
  ],
  industryAvgPe: 12.0,
  fairValue: 28500,
  verdict: "NẮM GIỮ",
  catalysts: [
    "Tăng trưởng tín dụng ổn định, chất lượng tài sản cải thiện.",
    "Chuyển đổi số, nâng cấp hệ thống ngân hàng số.",
    "Mở rộng mạng lưới chi nhánh tại các tỉnh thành.",
  ],
  risks: [
    "Áp lực từ chính sách tiền tệ của Ngân hàng Nhà nước.",
    "Cạnh tranh từ các ngân hàng lớn và fintech.",
    "Rủi ro tín dụng trong bối cảnh kinh tế biến động.",
  ],
  financialHealth: {
    debtToEquity: 7.8, // Normal for banks
    quickRatio: 0.12, // Normal for banks
    roe: 18.0,
    currentRatio: 0.10, // Normal for banks
  },
  projects: [
    {
      name: "Nâng cấp hệ thống ngân hàng số",
      description: "Đầu tư vào công nghệ, cải thiện trải nghiệm khách hàng qua ứng dụng di động.",
      progress: "Đang triển khai",
      impact: "Tăng hiệu quả hoạt động, giảm chi phí, thu hút khách hàng trẻ.",
    },
  ],
  checklist: [
    { condition: "Nếu giá giảm xuống dưới 25,000 VND", action: "MUA - Cơ hội tích lũy" },
    { condition: "Nếu tỷ lệ nợ xấu tăng trên 2.5%", action: "THẬN TRỌNG - Rủi ro tín dụng" },
  ],
  hawkeyeScore: 7.0,
  valuationHistory: [
    { period: "2022", pe: 13.2, pb: 1.6 },
    { period: "2023", pe: 14.0, pb: 1.8 },
    { period: "Q1-2024", pe: 14.2, pb: 1.9 },
    { period: "Current", pe: 14.5, pb: 2.0 },
  ],
};

/**
 * Stock data dictionary - lookup by ticker (case-insensitive)
 */
export const stockDataMap: Record<string, StockData> = {
  hpg: hpgData,
  fpt: fptData,
  mwg: mwgData,
  vcb: vcbData,
  vhm: vhmData,
  msn: msnData,
  stb: stbData,
};

/**
 * Get stock data by ticker (case-insensitive)
 */
export function getStockData(ticker: string): StockData | null {
  if (!ticker) return null;
  const normalizedTicker = ticker.toLowerCase().trim();
  return stockDataMap[normalizedTicker] || null;
}

/**
 * Get all available stock tickers
 */
export function getAllTickers(): string[] {
  return Object.keys(stockDataMap).map((key) => stockDataMap[key].ticker);
}

