/**
 * Mock data for HPG (Hoa Phat Group) - Realistic Vietnamese market data
 */

import { ValuationInput } from "@/lib/valuation-logic";

export const hpgMockData: ValuationInput & {
  name: string;
  sector: string;
  industry: string;
  marketCap: string;
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
} = {
  ticker: "HPG",
  name: "CTCP Tập đoàn Hòa Phát",
  sector: "Steel",
  industry: "Steel Production",
  marketCap: "Large (20,000 - 50,000 tỷ VND)",
  currentPrice: 28500,
  metrics: {
    eps: 1800, // VND per share
    pe: 15.8,
    pb: 1.6,
    bvps: 17800, // Book Value Per Share in VND
  },
  peers: [
    { ticker: "HSG", pe: 14.2, pb: 1.4 },
    { ticker: "NKG", pe: 16.5, pb: 1.5 },
    { ticker: "POM", pe: 20.0, pb: 0.9 },
    { ticker: "TVN", pe: 13.5, pb: 1.3 },
    { ticker: "SMC", pe: 18.2, pb: 1.7 },
  ],
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
    debtToEquity: 0.65, // 65%
    quickRatio: 1.2,
    roe: 18.5, // 18.5%
    currentRatio: 1.5,
  },
  projects: [
    {
      name: "Dự án Dung Quất 2",
      description:
        "Nhà máy thép mới tại Khu kinh tế Dung Quất với công suất 5 triệu tấn/năm. Dự án đang hoàn thành 80%, dự kiến vận hành Q1/2025.",
      progress: "80% hoàn thành",
      impact:
        "Khi hoàn thành, sẽ tăng tổng công suất sản xuất thép của HPG lên 30%, mở rộng thị phần và tăng doanh thu dự kiến 15-20% từ năm 2025.",
    },
  ],
  checklist: [
    {
      condition: "Nếu giá giảm xuống dưới 26,000 VND",
      action: "MUA MẠNH - Cơ hội tích lũy tốt",
    },
    {
      condition: "Nếu giá thép HRC thế giới giảm dưới $500/tấn",
      action: "XEM XÉT LẠI - Rủi ro biên lợi nhuận",
    },
    {
      condition: "Nếu Dung Quất 2 vận hành đúng tiến độ Q1/2025",
      action: "TÍCH LŨY - Triển vọng tăng trưởng mạnh",
    },
    {
      condition: "Nếu tỷ giá USD/VND tăng trên 25,000",
      action: "THẬN TRỌNG - Chi phí nguyên liệu tăng",
    },
  ],
};

