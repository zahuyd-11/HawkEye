import { NextResponse } from "next/server";

// Cache for 60 seconds
export const revalidate = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface MarketData {
  index: string;
  value: number;
  change: number;
  changePercent: number;
}

// Mock data - Replace with real API integration
async function fetchMarketData(): Promise<MarketData[]> {
  // Option 1: Alpha Vantage API (Free tier)
  // const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  // if (apiKey) {
  //   const response = await fetch(
  //     `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VNINDEX&apikey=${apiKey}`
  //   );
  //   const data = await response.json();
  //   // Process data...
  // }

  // Option 2: TradingEconomics API
  // const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
  // if (apiKey) {
  //   const response = await fetch(
  //     `https://api.tradingeconomics.com/markets/indices?c=${apiKey}`
  //   );
  //   const data = await response.json();
  //   // Process data...
  // }

  // For now, return mock data with slight randomization
  const baseData: MarketData[] = [
    { index: "VNIndex", value: 1234.56, change: 15.23, changePercent: 1.25 },
    { index: "HNX", value: 234.56, change: -1.05, changePercent: -0.45 },
    { index: "UPCOM", value: 89.12, change: 0.11, changePercent: 0.12 },
    { index: "GDP Growth", value: 5.2, change: 0.3, changePercent: 6.12 },
    { index: "CPI", value: 3.5, change: 0.2, changePercent: 6.06 },
    { index: "Interest Rate", value: 4.5, change: 0, changePercent: 0 },
  ];

  // Add small random variation to simulate real-time updates
  return baseData.map((item) => ({
    ...item,
    value: item.value + (Math.random() - 0.5) * 0.1,
    change: item.change + (Math.random() - 0.5) * 0.01,
    changePercent: ((item.change / (item.value - item.change)) * 100) || item.changePercent,
  }));
}

export async function GET() {
  try {
    const marketData = await fetchMarketData();

    const response = NextResponse.json(marketData);
    
    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: unknown) {
    console.error("Market data error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

