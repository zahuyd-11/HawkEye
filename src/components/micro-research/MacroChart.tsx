"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getChartDataByRange, type ChartDataPoint } from "@/data/mock-macro-data";

type TimeRange = "1M" | "6M" | "1Y";

export function MacroChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [chartType, setChartType] = useState<"usd" | "rate">("usd");

  const data = getChartDataByRange(timeRange);

  // Prepare data for chart
  const chartData = data.map((point) => ({
    date: point.date,
    "VN-Index": point.vnindex,
    [chartType === "usd" ? "Tỷ giá USD/VND" : "Lãi suất SBV"]: chartType === "usd" ? point.usd : point.interestRate,
  }));

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    return `${month}/${year.slice(-2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mối tương quan thị trường</CardTitle>
            <CardDescription>
              {chartType === "usd"
                ? "VN-Index vs. Tỷ giá USD/VND (Tương quan nghịch)"
                : "VN-Index vs. Lãi suất SBV"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={chartType === "usd" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("usd")}
                className="h-8 text-xs"
              >
                USD/VND
              </Button>
              <Button
                variant={chartType === "rate" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("rate")}
                className="h-8 text-xs"
              >
                Lãi suất
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time Range Tabs */}
        <div className="flex gap-2 mb-6">
          {(["1M", "6M", "1Y"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === "1M" ? "1 Tháng" : range === "6M" ? "6 Tháng" : "1 Năm"}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: "VN-Index", angle: -90, position: "insideLeft" }}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: chartType === "usd" ? "USD/VND" : "Lãi suất (%)",
                  angle: 90,
                  position: "insideRight",
                }}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelFormatter={(value) => `Tháng ${formatDate(value)}`}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="VN-Index"
                fill="#3b82f6"
                fillOpacity={0.2}
                stroke="#3b82f6"
                strokeWidth={2}
                name="VN-Index"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={chartType === "usd" ? "Tỷ giá USD/VND" : "Lãi suất SBV"}
                stroke={chartType === "usd" ? "#ef4444" : "#f59e0b"}
                strokeWidth={2}
                dot={false}
                name={chartType === "usd" ? "Tỷ giá USD/VND" : "Lãi suất SBV"}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Explanation Note */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
          <p className="text-muted-foreground">
            <strong>Giải thích:</strong>{" "}
            {chartType === "usd"
              ? "Khi tỷ giá USD/VND tăng, thị trường chứng khoán thường giảm do áp lực lạm phát và chi phí vay tăng. Đây là mối tương quan nghịch điển hình."
              : "Lãi suất tăng thường làm giảm tính hấp dẫn của cổ phiếu so với trái phiếu, dẫn đến dòng vốn rút khỏi thị trường chứng khoán."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

