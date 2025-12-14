"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import type { StockData } from "@/data/mock-stocks-data";

interface PeersComparisonChartProps {
  stockData: StockData;
}

export function PeersComparisonChart({ stockData }: PeersComparisonChartProps) {
  // Prepare chart data
  const chartData = [
    // Current company (highlighted)
    {
      ticker: stockData.ticker,
      pe: stockData.metrics.pe,
      type: "current",
    },
    // Industry average (reference line)
    {
      ticker: "TB Ngành",
      pe: stockData.industryAvgPe,
      type: "average",
    },
    // Peers
    ...stockData.peers.map((peer) => ({
      ticker: peer.ticker,
      pe: peer.pe,
      type: "peer",
    })),
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">{data.ticker}</p>
          <p className="text-sm text-muted-foreground">
            P/E: <span className="font-semibold text-foreground">{data.pe.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Get bar color based on type
  const getBarColor = (type: string) => {
    switch (type) {
      case "current":
        return "#3b82f6"; // Blue for current company
      case "average":
        return "#6b7280"; // Gray for industry average
      default:
        return "#10b981"; // Green for peers
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>So sánh Định giá (P/E)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="ticker"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                label={{ value: "P/E Ratio", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--muted-foreground))" } }}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stockData.industryAvgPe}
                stroke="#6b7280"
                strokeDasharray="5 5"
                label={{ value: "TB Ngành", position: "right", fill: "#6b7280", fontSize: 12 }}
              />
              <Bar
                dataKey="pe"
                radius={[4, 4, 0, 0]}
                name="P/E Ratio"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-500" />
              <span className="text-muted-foreground">{stockData.ticker} (Công ty hiện tại)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-500" />
              <span className="text-muted-foreground">TB Ngành (Trung bình ngành)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-emerald-500" />
              <span className="text-muted-foreground">Đồng nghiệp (Top 5)</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">P/E {stockData.ticker}</p>
              <p className="text-lg font-semibold">{stockData.metrics.pe.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">TB Ngành</p>
              <p className="text-lg font-semibold">{stockData.industryAvgPe.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Chênh lệch</p>
              <p
                className={`text-lg font-semibold ${
                  stockData.metrics.pe > stockData.industryAvgPe ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {stockData.metrics.pe > stockData.industryAvgPe ? "+" : ""}
                {((stockData.metrics.pe - stockData.industryAvgPe) / stockData.industryAvgPe * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

