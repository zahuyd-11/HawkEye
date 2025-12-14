"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { calculateValuation, formatPrice, formatPercentage, type ValuationResult } from "@/lib/valuation-logic";
import type { StockData } from "@/data/mock-stocks-data";
import { PeersComparisonChart } from "./PeersComparisonChart";
import { ValuationTrendChart } from "./ValuationTrendChart";

interface DealDigestWebProps {
  data: StockData;
}

export function DealDigestWeb({ data }: DealDigestWebProps) {
  const valuation = calculateValuation(data);

  // Get verdict color and icon
  const getVerdictStyle = (verdict: ValuationResult["verdict"]) => {
    switch (verdict) {
      case "STRONG_BUY":
      case "BUY":
        return {
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/50",
          icon: TrendingUp,
        };
      case "HOLD":
        return {
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/50",
          icon: Minus,
        };
      case "SELL":
      case "STRONG_SELL":
        return {
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/50",
          icon: TrendingDown,
        };
    }
  };

  const verdictStyle = getVerdictStyle(valuation.verdict);
  const VerdictIcon = verdictStyle.icon;

  // Calculate gauge percentage (0-100% for visual)
  const gaugePercentage = Math.min(Math.max(((valuation.compositeFairValue - data.currentPrice) / data.currentPrice) * 50 + 50, 0), 100);

  // Determine gauge color
  const getGaugeColor = () => {
    if (valuation.upsidePercentage >= 20) return "bg-emerald-500";
    if (valuation.upsidePercentage >= 5) return "bg-emerald-400";
    if (valuation.upsidePercentage >= -5) return "bg-yellow-500";
    if (valuation.upsidePercentage >= -15) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">{data.ticker}</h1>
          <p className="text-xl text-muted-foreground mt-1">{data.name}</p>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-sm text-muted-foreground">Giá hiện tại</p>
              <p className="text-2xl font-bold">{formatPrice(data.currentPrice)} VND</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-sm text-muted-foreground">HawkEye Score</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{data.hawkeyeScore.toFixed(1)}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`px-6 py-3 rounded-lg border-2 ${verdictStyle.bgColor} ${verdictStyle.borderColor}`}>
          <div className="flex items-center gap-2">
            <VerdictIcon className={`h-6 w-6 ${verdictStyle.color}`} />
            <div>
              <p className="text-xs text-muted-foreground">Khuyến nghị</p>
              <p className={`text-xl font-bold ${verdictStyle.color}`}>{valuation.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fair Value Speedometer */}
      <Card>
        <CardHeader>
          <CardTitle>Fair Value Gap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Gauge Visualization */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Giá hiện tại</p>
                  <p className="text-xl font-bold">{formatPrice(data.currentPrice)} VND</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Fair Value</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(valuation.compositeFairValue)} VND</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Upside</p>
                  <p
                    className={`text-xl font-bold ${
                      valuation.upsidePercentage >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {formatPercentage(valuation.upsidePercentage)}
                  </p>
                </div>
              </div>

              {/* Progress Bar Gauge */}
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${getGaugeColor()} transition-all duration-500 rounded-full`}
                  style={{
                    width: `${gaugePercentage}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-1 bg-background rounded-full border-2 border-foreground" />
                </div>
              </div>

              {/* Labels */}
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Overvalued</span>
                <span>Fair Value</span>
                <span>Undervalued</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fair Value (P/E)</p>
                <p className="text-lg font-semibold">{formatPrice(valuation.fairValuePE)} VND</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fair Value (P/B)</p>
                <p className="text-lg font-semibold">{formatPrice(valuation.fairValuePB)} VND</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                <p
                  className={`text-lg font-semibold ${
                    valuation.riskLevel === "LOW"
                      ? "text-emerald-600"
                      : valuation.riskLevel === "MEDIUM"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {valuation.riskLevel === "LOW" ? "Thấp" : valuation.riskLevel === "MEDIUM" ? "Trung bình" : "Cao"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* P/E Comparison Chart */}
      <PeersComparisonChart stockData={data} />

      {/* Valuation Trends Chart */}
      <ValuationTrendChart stockData={data} />

      {/* Key Highlights - Catalysts */}
      <Card>
        <CardHeader>
          <CardTitle>Điểm Nổi Bật</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.catalysts.slice(0, 3).map((catalyst, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <p className="text-sm leading-relaxed">{catalyst}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <div className="flex justify-center">
        <Link href={`/dashboard/deal-digest/${data.ticker.toLowerCase()}/report`}>
          <Button size="lg" className="w-full sm:w-auto">
            <Download className="mr-2 h-5 w-5" />
            Tải Báo Cáo Chi Tiết (PDF)
          </Button>
        </Link>
      </div>
    </div>
  );
}

