"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, Shield, Target, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { type StrategyProfile, getProfileColor, getProfileBgColor } from "@/lib/strategy-logic";

interface StrategyDashboardProps {
  profile: StrategyProfile;
  score: number;
  onRetakeSurvey: () => void;
}

export function StrategyDashboard({ profile, score, onRetakeSurvey }: StrategyDashboardProps) {
  // Prepare data for pie chart
  const allocationData = [
    { name: "Cổ phiếu", value: profile.allocation.stocks, color: "#3b82f6" }, // Blue
  ];

  // Add ETFs if exists
  if (profile.allocation.etfs) {
    allocationData.push({
      name: "ETF (VFMVN30, FUEVFVND)",
      value: profile.allocation.etfs,
      color: "#9333ea", // Purple
    });
  }

  // Add bonds
  allocationData.push({
    name: "Trái phiếu",
    value: profile.allocation.bonds,
    color: "#10b981", // Green
  });

  // Add cash
  allocationData.push({
    name: "Tiền mặt",
    value: profile.allocation.cash,
    color: "#6b7280", // Gray
  });

  // Add alternatives if exists
  if (profile.allocation.alternatives) {
    allocationData.push({
      name: "Tài sản thay thế",
      value: profile.allocation.alternatives,
      color: "#f59e0b", // Orange
    });
  }

  const profileColor = getProfileColor(profile.id);
  const profileBgColor = getProfileBgColor(profile.id);

  // Build DealDigest filter URL - for now just link to the list page
  // In production, this could filter by the focus stocks
  const dealDigestUrl = `/dashboard/deal-digest`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-lg border-2 ${profileBgColor}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hồ sơ đầu tư của bạn</p>
            <h1 className={`text-3xl font-bold ${profileColor}`}>{profile.nameVietnamese}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{profile.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Điểm khảo sát</p>
            <p className="text-2xl font-bold">{score} / 40</p>
          </div>
        </div>
      </div>

      {/* Asset Allocation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Phân bổ Tài sản
          </CardTitle>
          <CardDescription>Chiến lược phân bổ vốn theo hồ sơ của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Allocation Details */}
            <div className="space-y-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HawkEye Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quy tắc HawkEye
          </CardTitle>
          <CardDescription>Nguyên tắc quản lý rủi ro và vị thế theo hồ sơ của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="font-semibold">Kích thước vị thế tối đa</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Tối đa <strong className="text-foreground">{profile.maxPositionSize}% NAV</strong> mỗi cổ phiếu
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="font-semibold">Quy tắc Cắt lỗ</p>
              </div>
              <p className="text-sm text-muted-foreground">{profile.stopLoss.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Khoảng: {profile.stopLoss.min}% đến {profile.stopLoss.max}%
              </p>
            </div>

            <div className="p-4 border rounded-lg md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <p className="font-semibold">Chiến lược Chốt lời</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  • Bán <strong className="text-foreground">{profile.takeProfit.firstTargetPercent}%</strong> vị thế khi đạt{" "}
                  <strong className="text-foreground">+{profile.takeProfit.firstTarget}%</strong>
                </p>
                {profile.takeProfit.secondTarget && (
                  <p>
                    • Bán thêm <strong className="text-foreground">{profile.takeProfit.secondTargetPercent}%</strong> khi đạt{" "}
                    <strong className="text-foreground">+{profile.takeProfit.secondTarget}%</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Stocks */}
      <Card>
        <CardHeader>
          <CardTitle>Cổ phiếu Phù hợp</CardTitle>
          <CardDescription>Danh sách cổ phiếu được đề xuất theo hồ sơ của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.focusStocks.map((ticker) => (
              <span
                key={ticker}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono font-semibold"
              >
                {ticker}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Các cổ phiếu này phù hợp với chiến lược <strong>{profile.nameVietnamese}</strong> của bạn
          </p>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={dealDigestUrl} className="flex-1">
          <Button size="lg" className="w-full">
            <TrendingUp className="mr-2 h-5 w-5" />
            Xem danh sách cổ phiếu phù hợp
          </Button>
        </Link>
        <Button size="lg" variant="outline" onClick={onRetakeSurvey} className="flex-1">
          <RefreshCw className="mr-2 h-5 w-5" />
          Làm lại khảo sát
        </Button>
      </div>
    </div>
  );
}

