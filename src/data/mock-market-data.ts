export interface MarketData {
  index: string;
  value: number;
  change: number;
  changePercent: number;
}

// Base market data - values will be slightly randomized
const baseMarketData: MarketData[] = [
  {
    index: "VN-INDEX",
    value: 1250.45,
    change: 12.5,
    changePercent: 1.01,
  },
  {
    index: "HNX-INDEX",
    value: 245.78,
    change: -2.3,
    changePercent: -0.93,
  },
  {
    index: "GOLD",
    value: 72500.0,
    change: 250.0,
    changePercent: 0.35,
  },
  {
    index: "BITCOIN",
    value: 1850000.0,
    change: -15000.0,
    changePercent: -0.80,
  },
  {
    index: "OIL",
    value: 85.25,
    change: 0.75,
    changePercent: 0.89,
  },
];

// Function to generate slightly randomized market data
export function generateMockMarketData(): MarketData[] {
  return baseMarketData.map((item) => {
    // Add small random variation (±0.5% to value)
    const variation = (Math.random() - 0.5) * 0.01; // ±0.5%
    const newValue = item.value * (1 + variation);
    const newChange = item.change * (1 + variation * 0.1);
    const newChangePercent = (newChange / (newValue - newChange)) * 100;

    return {
      index: item.index,
      value: Math.round(newValue * 100) / 100,
      change: Math.round(newChange * 100) / 100,
      changePercent: Math.round(newChangePercent * 100) / 100,
    };
  });
}

// Export initial data
export const initialMarketData: MarketData[] = baseMarketData;

