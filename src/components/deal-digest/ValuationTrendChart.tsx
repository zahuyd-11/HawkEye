"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockData } from "@/data/mock-stocks-data";

interface ValuationTrendChartProps {
  stockData: StockData;
}

export function ValuationTrendChart({ stockData }: ValuationTrendChartProps) {
  if (!stockData.valuationHistory || stockData.valuationHistory.length === 0) {
    return null;
  }

  const chartData = stockData.valuationHistory.map((item) => ({
    period: item.period,
    pe: Number(item.pe.toFixed(1)),
    pb: Number(item.pb.toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{`Kỳ: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.dataKey === "pe" ? "" : ""}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng Định giá (Lịch sử)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="period"
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="currentColor"
            />
            <YAxis
              yAxisId="left"
              label={{ value: "P/E", angle: -90, position: "insideLeft" }}
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="#3b82f6"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "P/B", angle: 90, position: "insideRight" }}
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="#f97316"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pe"
              name="P/E"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pb"
              name="P/B"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

