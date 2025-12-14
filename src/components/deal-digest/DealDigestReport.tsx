"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { calculateValuation, formatPrice, formatPercentage } from "@/lib/valuation-logic";
import { hpgMockData } from "@/data/mock-hpg-data";

interface DealDigestReportProps {
  data?: typeof hpgMockData;
}

export function DealDigestReport({ data = hpgMockData }: DealDigestReportProps) {
  const valuation = calculateValuation(data);

  // Get recommendation badge style
  const getRecommendationStyle = (verdict: string) => {
    switch (verdict) {
      case "STRONG_BUY":
      case "BUY":
        return "bg-emerald-500 text-white";
      case "HOLD":
        return "bg-yellow-500 text-white";
      case "SELL":
      case "STRONG_SELL":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Financial health check
  const financialChecks = [
    {
      metric: "Debt/Equity",
      value: `${(data.financialHealth.debtToEquity * 100).toFixed(1)}%`,
      threshold: "< 70%",
      pass: data.financialHealth.debtToEquity < 0.7,
      description: "Tỷ lệ nợ/vốn chủ sở hữu",
    },
    {
      metric: "Quick Ratio",
      value: data.financialHealth.quickRatio.toFixed(2),
      threshold: "> 1.0",
      pass: data.financialHealth.quickRatio > 1.0,
      description: "Khả năng thanh toán nhanh",
    },
    {
      metric: "ROE",
      value: `${data.financialHealth.roe.toFixed(1)}%`,
      threshold: "> 15%",
      pass: data.financialHealth.roe > 15,
      description: "Tỷ suất sinh lời trên vốn chủ sở hữu",
    },
    {
      metric: "Current Ratio",
      value: data.financialHealth.currentRatio.toFixed(2),
      threshold: "> 1.2",
      pass: data.financialHealth.currentRatio > 1.2,
      description: "Tỷ lệ thanh khoản hiện tại",
    },
  ];

  // Risk score breakdown (mock - can be calculated from actual data)
  const riskScores = {
    financial: 8,
    growth: 7,
    market: 6,
    operational: 7,
  };
  const overallRiskScore = (riskScores.financial + riskScores.growth + riskScores.market + riskScores.operational) / 4;

  return (
    <div className="bg-white text-black print:bg-white print:text-black" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "20mm" }}>
      {/* Zone 1: Executive Summary */}
      <div className="mb-8 border-b-2 border-gray-800 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{data.ticker}</h1>
            <p className="text-lg text-gray-700">{data.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {data.sector} • {data.industry} • {data.marketCap}
            </p>
          </div>
          <div className={`px-4 py-2 rounded ${getRecommendationStyle(valuation.verdict)}`}>
            <p className="text-xs font-medium mb-1">KHUYẾN NGHỊ</p>
            <p className="text-2xl font-bold">{valuation.recommendation}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Giá hiện tại</p>
            <p className="text-xl font-bold">{formatPrice(data.currentPrice)} VND</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Fair Value</p>
            <p className="text-xl font-bold text-blue-700">{formatPrice(valuation.compositeFairValue)} VND</p>
          </div>
        </div>

        {/* Risk Score Breakdown */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Tài chính</p>
            <p className="text-lg font-bold">{riskScores.financial}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Tăng trưởng</p>
            <p className="text-lg font-bold">{riskScores.growth}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Thị trường</p>
            <p className="text-lg font-bold">{riskScores.market}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Vận hành</p>
            <p className="text-lg font-bold">{riskScores.operational}/10</p>
          </div>
          <div className="text-center border-l-2 border-gray-300 pl-2">
            <p className="text-xs text-gray-600 mb-1">Tổng thể</p>
            <p className="text-lg font-bold">{overallRiskScore.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      {/* Zone 2: Valuation X-Ray */}
      <div className="mb-8 border-b-2 border-gray-800 pb-6">
        <h2 className="text-xl font-bold mb-4">VALUATION X-RAY</h2>

        {/* Peer Comparison Table */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">So sánh với ngành (Top 5 peers)</h3>
          <table className="w-full text-xs border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">Mã CK</th>
                <th className="border border-gray-300 px-2 py-1 text-right">P/E</th>
                <th className="border border-gray-300 px-2 py-1 text-right">P/B</th>
              </tr>
            </thead>
            <tbody>
              {data.peers.map((peer, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1 font-mono">{peer.ticker}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{peer.pe?.toFixed(1) || "—"}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{peer.pb?.toFixed(2) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Phương pháp P/E (Price-to-Earnings)</h3>
            <div className="bg-gray-50 p-3 rounded text-xs">
              <div className="font-mono space-y-1">
                <p>
                  Industry Avg P/E = ({data.peers.map((p) => p.pe).filter((p): p is number => !!p).join(" + ")}) / {data.peers.filter((p) => p.pe).length} = <strong>{valuation.industryAvgPE.toFixed(2)}</strong>
                </p>
                <p>
                  Fair Value (P/E) = EPS × Industry Avg P/E
                </p>
                <p className="ml-4">
                  = {formatPrice(data.metrics.eps)} × {valuation.industryAvgPE.toFixed(2)} = <strong className="text-blue-700">{formatPrice(valuation.fairValuePE)} VND</strong>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Phương pháp P/B (Price-to-Book)</h3>
            <div className="bg-gray-50 p-3 rounded text-xs">
              <div className="font-mono space-y-1">
                <p>
                  Industry Avg P/B = ({data.peers.map((p) => p.pb).filter((p): p is number => !!p).join(" + ")}) / {data.peers.filter((p) => p.pb).length} = <strong>{valuation.industryAvgPB.toFixed(2)}</strong>
                </p>
                <p>
                  Fair Value (P/B) = BVPS × Industry Avg P/B
                </p>
                <p className="ml-4">
                  = {formatPrice(data.metrics.bvps)} × {valuation.industryAvgPB.toFixed(2)} = <strong className="text-blue-700">{formatPrice(valuation.fairValuePB)} VND</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm font-semibold mb-1">Kết luận Fair Value:</p>
            <p className="text-xs">
              Composite Fair Value = (Fair Value P/E + Fair Value P/B) / 2 = <strong className="text-blue-700">{formatPrice(valuation.compositeFairValue)} VND</strong>
            </p>
            <p className="text-xs mt-1">
              Upside Potential: <strong className={valuation.upsidePercentage >= 0 ? "text-green-700" : "text-red-700"}>{formatPercentage(valuation.upsidePercentage)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Zone 3: Financial Health & Projects */}
      <div className="mb-8 border-b-2 border-gray-800 pb-6">
        <h2 className="text-xl font-bold mb-4">FINANCIAL HEALTH & PROJECTS</h2>

        {/* Financial Health Table */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Tình hình tài chính</h3>
          <table className="w-full text-xs border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">Chỉ số</th>
                <th className="border border-gray-300 px-2 py-1 text-right">Giá trị</th>
                <th className="border border-gray-300 px-2 py-1 text-right">Ngưỡng</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Kết quả</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {financialChecks.map((check, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1 font-semibold">{check.metric}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-mono">{check.value}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right text-gray-600">{check.threshold}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {check.pass ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-gray-600">{check.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Project Spotlight */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Dự án trọng điểm</h3>
          {data.projects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold mb-2">{project.name}</h4>
              <p className="text-xs text-gray-700 mb-2 leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-600">
                  <strong>Tiến độ:</strong> {project.progress}
                </span>
                <span className="text-gray-600">
                  <strong>Tác động:</strong> {project.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone 4: HawkEye Checklist */}
      <div>
        <h2 className="text-xl font-bold mb-4">HAWKEYE CHECKLIST</h2>
        <div className="space-y-2">
          {data.checklist.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border-l-4 border-yellow-500">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">Nếu {item.condition}</p>
                <p className="text-xs text-gray-700">→ {item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600 text-center">
        <p>HawkEye Investment Decision Support Platform</p>
        <p className="mt-1">Báo cáo này chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư cá nhân.</p>
      </div>
    </div>
  );
}

