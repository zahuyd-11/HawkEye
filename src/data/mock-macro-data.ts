/**
 * Mock Macro Data for Vietnamese Market
 * Realistic data showing correlations and trends
 */

export interface MacroStat {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  unit: string;
  description: string;
}

export interface ChartDataPoint {
  date: string;
  vnindex: number;
  usd: number;
  interestRate: number;
  oilPrice: number;
}

export interface NewsEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  category: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
}

/**
 * Current Macro Statistics (Top Bar)
 */
export const macroStats: MacroStat[] = [
  {
    id: "vnindex",
    name: "VN-INDEX",
    value: 1250.5,
    change: 15.2,
    changePercent: 1.23,
    unit: "điểm",
    description: "Chỉ số chứng khoán Việt Nam",
  },
  {
    id: "usd",
    name: "Tỷ giá USD/VND",
    value: 25450,
    change: 125,
    changePercent: 0.49,
    unit: "VND",
    description: "Tỷ giá đồng USD so với VND",
  },
  {
    id: "interest",
    name: "Lãi suất SBV",
    value: 4.5,
    change: 0,
    changePercent: 0,
    unit: "%",
    description: "Lãi suất cơ bản Ngân hàng Nhà nước",
  },
  {
    id: "oil",
    name: "Giá Dầu",
    value: 80.5,
    change: 0.9,
    changePercent: 1.13,
    unit: "$/thùng",
    description: "Giá dầu thô thế giới (WTI)",
  },
  {
    id: "dxy",
    name: "DXY",
    value: 104.5,
    change: -0.2,
    changePercent: -0.19,
    unit: "điểm",
    description: "Chỉ số Dollar Index (USD so với các đồng tiền chính)",
  },
];

/**
 * Historical Chart Data (Last 12 months)
 * Shows inverse correlation: VNIndex drops when USD rises
 */
export const chartData: ChartDataPoint[] = [
  { date: "2024-01", vnindex: 1180, usd: 24300, interestRate: 4.5, oilPrice: 72.5 },
  { date: "2024-02", vnindex: 1200, usd: 24400, interestRate: 4.5, oilPrice: 74.0 },
  { date: "2024-03", vnindex: 1220, usd: 24500, interestRate: 4.5, oilPrice: 75.5 },
  { date: "2024-04", vnindex: 1210, usd: 24700, interestRate: 4.5, oilPrice: 78.0 },
  { date: "2024-05", vnindex: 1195, usd: 24800, interestRate: 4.5, oilPrice: 79.5 },
  { date: "2024-06", vnindex: 1185, usd: 25000, interestRate: 4.5, oilPrice: 80.0 },
  { date: "2024-07", vnindex: 1170, usd: 25100, interestRate: 4.5, oilPrice: 81.0 },
  { date: "2024-08", vnindex: 1165, usd: 25200, interestRate: 4.5, oilPrice: 82.0 },
  { date: "2024-09", vnindex: 1180, usd: 25300, interestRate: 4.5, oilPrice: 80.5 },
  { date: "2024-10", vnindex: 1200, usd: 25350, interestRate: 4.5, oilPrice: 79.0 },
  { date: "2024-11", vnindex: 1230, usd: 25400, interestRate: 4.5, oilPrice: 78.5 },
  { date: "2024-12", vnindex: 1250, usd: 25450, interestRate: 4.5, oilPrice: 80.5 },
];

/**
 * Impact News Feed
 */
export const impactNews: NewsEvent[] = [
  {
    id: "1",
    date: "2024-12-15",
    title: "Ngân hàng Nhà nước hút tiền qua tín phiếu",
    description: "SBV phát hành 20.000 tỷ VND tín phiếu, tăng áp lực thanh khoản",
    impact: "NEGATIVE",
    category: "Tiền tệ",
  },
  {
    id: "2",
    date: "2024-12-14",
    title: "Fed giữ nguyên lãi suất, tín hiệu tích cực cho thị trường",
    description: "Fed quyết định giữ lãi suất ở mức 5.25-5.5%, thị trường phản ứng tích cực",
    impact: "POSITIVE",
    category: "Quốc tế",
  },
  {
    id: "3",
    date: "2024-12-13",
    title: "GDP Q4 tăng trưởng 5.8%, vượt kỳ vọng",
    description: "Kinh tế Việt Nam tiếp tục phục hồi mạnh mẽ trong quý cuối năm",
    impact: "POSITIVE",
    category: "Kinh tế",
  },
  {
    id: "4",
    date: "2024-12-12",
    title: "Giá dầu thế giới tăng do căng thẳng địa chính trị",
    description: "Giá dầu WTI tăng 2% sau thông tin về căng thẳng tại Trung Đông",
    impact: "NEGATIVE",
    category: "Nguyên liệu",
  },
  {
    id: "5",
    date: "2024-12-11",
    title: "CPI tháng 11 tăng 3.2%, trong tầm kiểm soát",
    description: "Lạm phát vẫn ở mức thấp, tạo không gian cho chính sách tiền tệ linh hoạt",
    impact: "NEUTRAL",
    category: "Kinh tế",
  },
  {
    id: "6",
    date: "2024-12-10",
    title: "Dòng vốn ngoại tiếp tục rút khỏi thị trường",
    description: "Nhà đầu tư nước ngoài bán ròng 500 tỷ VND trong tuần qua",
    impact: "NEGATIVE",
    category: "Vốn",
  },
];

/**
 * Economic Calendar Events
 */
export const economicEvents: EconomicEvent[] = [
  {
    id: "1",
    date: "2024-12-20",
    title: "Ngày đáo hạn phái sinh",
    description: "Ngày đáo hạn hợp đồng phái sinh tháng 12",
    importance: "HIGH",
  },
  {
    id: "2",
    date: "2024-12-19",
    title: "Fed Meeting Minutes",
    description: "Công bố biên bản cuộc họp FOMC tháng 12",
    importance: "HIGH",
  },
  {
    id: "3",
    date: "2024-12-18",
    title: "Công bố CPI tháng 12",
    description: "Tổng cục Thống kê công bố chỉ số giá tiêu dùng",
    importance: "MEDIUM",
  },
  {
    id: "4",
    date: "2024-12-17",
    title: "Họp HĐQT Ngân hàng Nhà nước",
    description: "Quyết định về chính sách tiền tệ quý IV",
    importance: "HIGH",
  },
  {
    id: "5",
    date: "2024-12-16",
    title: "Công bố GDP Q4",
    description: "Tổng cục Thống kê công bố tăng trưởng GDP quý 4",
    importance: "HIGH",
  },
  {
    id: "6",
    date: "2024-12-15",
    title: "Ngày đáo hạn trái phiếu chính phủ",
    description: "Đáo hạn trái phiếu chính phủ kỳ hạn 5 năm",
    importance: "MEDIUM",
  },
];

/**
 * Get filtered chart data by time range
 */
export function getChartDataByRange(range: "1M" | "6M" | "1Y"): ChartDataPoint[] {
  const now = new Date();
  let monthsBack = 12;

  if (range === "1M") {
    monthsBack = 1;
  } else if (range === "6M") {
    monthsBack = 6;
  }

  const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  
  return chartData.filter((point) => {
    const pointDate = new Date(point.date + "-01");
    return pointDate >= cutoffDate;
  });
}

/**
 * Format number with Vietnamese locale
 */
export function formatMacroValue(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatMacroPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

