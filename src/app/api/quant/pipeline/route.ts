import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { detectMarketRegime, MarketSignals } from '@/lib/quant/regime-detector';
import { computeSpecificAllocation, AssetMetrics } from '@/lib/quant/portfolio-optimizer';

// Mock API Call đóng vai trò proxy kết nối với nguồn cấp dữ liệu thật (như FiinGroup/SSI hoặc Yahoo Finance)
async function fetchRealtimeMarketData(sectors: string[]): Promise<AssetMetrics[]> {
  // Bản đồ phân tách các lớp tài sản theo chuẩn CFA Portfolio Management
  return [
    { ticker: 'FPT', expectedReturn: 0.25, volatility: 0.18, sector: 'Công nghệ' },
    { ticker: 'HPG', expectedReturn: 0.22, volatility: 0.28, sector: 'Thép' },
    { ticker: 'VCB', expectedReturn: 0.15, volatility: 0.12, sector: 'Ngân hàng' },
    { ticker: 'MWG', expectedReturn: 0.18, volatility: 0.22, sector: 'Bán lẻ' },
    { ticker: 'E1VFVN30', expectedReturn: 0.12, volatility: 0.15, sector: 'VN_ETF' },
    { ticker: 'FUEVFVND', expectedReturn: 0.16, volatility: 0.14, sector: 'VN_ETF' },
    { ticker: 'SPY', expectedReturn: 0.10, volatility: 0.11, sector: 'US_ETF' },
    { ticker: 'VOO', expectedReturn: 0.11, volatility: 0.11, sector: 'US_ETF' },
    { ticker: 'USD/VND', expectedReturn: 0.03, volatility: 0.02, sector: 'FOREX' },
    { ticker: 'VGBOND_10Y', expectedReturn: 0.06, volatility: 0.04, sector: 'BOND' }
  ];
}

export async function POST(request: Request) {
  try {
    // 1. Chuyển đổi hạ tầng: Sử dụng NextAuth để đọc Session thay vì Supabase
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized access blocked' }, { status: 401 });
    }

    // 2. Nhận gói tham số cá nhân hóa động từ Frontend
    const { totalCapital, maxDrawdownAcceptable, sectorsOfInterest } = await request.json();

    if (!totalCapital || !maxDrawdownAcceptable || !sectorsOfInterest) {
      return NextResponse.json({ error: 'Missing input fields' }, { status: 400 });
    }

    // 3. Giả định luồng dữ liệu vĩ mô cập nhật liên tục từ thị trường (SBV, tỷ giá, độ lệch chuẩn)
    const macroSignals: MarketSignals = {
      vnimav_20_deviation: -0.02,     // VN-Index đang nằm dưới MA20 2%
      sbv_net_injection_30d: -12000000000000, // Ngân hàng Nhà nước đang hút ròng 12k tỷ
      fx_usdvnd_ytd_change: 0.035,   // Tỷ giá tăng 3.5% từ đầu năm (Áp lực trung bình)
      vix_vn: 18                      // Độ biến động nội tại đang ở mức trung bình
    };

    // 4. Thực thi lõi toán định lượng phân bổ tài sản
    const currentRegime = detectMarketRegime(macroSignals);
    const liveAssetPool = await fetchRealtimeMarketData(sectorsOfInterest);
    
    const optimizedResult = computeSpecificAllocation(
      { totalCapital, maxDrawdownAcceptable, sectorsOfInterest },
      currentRegime,
      liveAssetPool
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: optimizedResult
    });

  } catch (error: any) {
    console.error("Quant pipeline error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

