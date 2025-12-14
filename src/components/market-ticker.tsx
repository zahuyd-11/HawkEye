"use client";

import { useEffect, useState } from "react";
import { generateMockMarketData, type MarketData } from "@/data/mock-market-data";

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  // Initialize with mock data and update every 3 seconds
  useEffect(() => {
    // Set initial data
    setMarketData(generateMockMarketData());

    // Update data every 3 seconds to make it "tick"
    const interval = setInterval(() => {
      setMarketData(generateMockMarketData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate data for seamless scrolling
  const duplicatedData = [...marketData, ...marketData];

  if (marketData.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 py-2">
        <div className="flex items-center justify-center">
          <span className="text-sm text-slate-400">Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-lg">
      <div className="flex animate-scroll w-max">
        {duplicatedData.map((data, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-6 py-3 whitespace-nowrap border-r border-slate-700/50 hover:bg-slate-800/50 transition-colors"
          >
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wider min-w-[60px]">{data.index}</span>
            <span className="font-mono text-white text-sm font-bold tabular-nums min-w-[80px]">
              {data.value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                  data.change >= 0 
                    ? "text-emerald-300 bg-emerald-500/20" 
                    : "text-red-300 bg-red-500/20"
                }`}
              >
                {data.change >= 0 ? "▲" : "▼"} {data.change >= 0 ? "+" : ""}
                {data.change.toFixed(2)}
              </span>
              <span
                className={`font-mono text-xs font-semibold tabular-nums ${
                  data.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                ({data.changePercent >= 0 ? "+" : ""}{data.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

