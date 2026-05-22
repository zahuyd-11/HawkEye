"use client";

import Link from "next/link";
import { Download, ArrowLeft, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CfaRiskReport } from "@/lib/quant/cfa-risk-report";

interface Props {
  report: CfaRiskReport;
  htmlReport?: string;
}

export function CfaRiskReportView({ report, htmlReport }: Props) {
  const signalColor =
    report.recommendation === "BUY"
      ? "text-emerald-400 bg-emerald-500/15"
      : report.recommendation === "SELL"
        ? "text-rose-400 bg-rose-500/15"
        : "text-amber-400 bg-amber-500/15";

  return (
    <div className="space-y-8">
      <Link href="/dashboard/risk-desk">
        <Button variant="ghost" className="rounded-2xl text-zinc-400 hover:text-white -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Risk Desk
        </Button>
      </Link>

      <header className="obsidian-glass rounded-2xl p-6 border-hawkeye-glow">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-hawkeye-glow uppercase tracking-widest">
              CFA Risk Digest · HawkEye OpenClaw
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">
              {report.ticker} — {report.companyName}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">{report.sector} · {report.dataLineage}</p>
          </div>
          <span className={`text-sm font-bold px-4 py-2 rounded-xl h-fit ${signalColor}`}>
            {report.recommendation}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Metric label="Giá TT" value={`${report.currentPrice.toLocaleString("vi-VN")}`} sub={report.priceSource} />
          <Metric label="Giá mục tiêu (DCF)" value={`${report.targetPrice.toLocaleString("vi-VN")}`} sub={`${report.upsidePct >= 0 ? "+" : ""}${report.upsidePct}%`} />
          <Metric label="Conviction" value={`${report.convictionScore}/100`} />
          <Metric label="Risk score" value={`${report.riskScore}/10`} />
        </div>

        <p className="text-sm text-zinc-300 mt-5 leading-relaxed border-t border-white/[0.06] pt-4">
          {report.executiveSummary}
        </p>
      </header>

      <section className="obsidian-glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-hawkeye-glow" />
          DuPont (ROE decomposition)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {Object.entries(report.dupontAnalysis).map(([k, v]) => (
            <div key={k} className="bg-hawkeye-obsidian/50 rounded-xl py-3 px-2">
              <p className="text-[9px] text-zinc-600 uppercase">{k}</p>
              <p className="text-sm font-mono text-hawkeye-glow-bright mt-1">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="obsidian-glass rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-sm font-semibold text-white mb-4">
          DCF 5 năm — FCFF (WACC {(report.dcfForecast.wacc * 100).toFixed(1)}%, g{" "}
          {(report.dcfForecast.terminalGrowth * 100).toFixed(1)}%)
        </h2>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-zinc-500 border-b border-white/[0.06]">
              <th className="text-left py-2">Năm</th>
              <th className="text-right py-2">DT (tỷ)</th>
              <th className="text-right py-2">EBIT</th>
              <th className="text-right py-2">Thuế</th>
              <th className="text-right py-2">CapEx</th>
              <th className="text-right py-2">ΔWC</th>
              <th className="text-right py-2">FCFF</th>
              <th className="text-right py-2">PV FCFF</th>
            </tr>
          </thead>
          <tbody>
            {report.dcfForecast.forecastYears.map((y) => (
              <tr key={y.year} className="border-b border-white/[0.03] text-zinc-300">
                <td className="py-2 text-hawkeye-glow">{y.year}</td>
                <td className="text-right py-2">{y.revenue.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2">{y.ebit.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2">{y.tax.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2">{y.capex.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2">{y.workingCapitalChange.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2 text-white">{y.fcff.toLocaleString("vi-VN")}</td>
                <td className="text-right py-2 text-emerald-400/90">{y.pvFcff.toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap gap-6 mt-4 text-xs font-mono text-zinc-400">
          <span>TV: {report.dcfForecast.terminalValue.toLocaleString("vi-VN")} tỷ</span>
          <span>EV: {report.dcfForecast.enterpriseValue.toLocaleString("vi-VN")} tỷ</span>
        </div>
      </section>

      {report.segmentNotes.length > 0 && (
        <section className="obsidian-glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-3">Phân mảng doanh thu</h2>
          <ul className="space-y-2">
            {report.segmentNotes.map((s) => (
              <li key={s.segment} className="text-xs text-zinc-400 flex justify-between gap-4">
                <span className="text-zinc-200">
                  {s.segment} ({s.revenueSharePct}%)
                </span>
                <span>{s.growthOutlook}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="obsidian-glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-3">Action checklist</h2>
        <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
          {report.actionChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {htmlReport && (
        <div className="flex gap-3">
          <Button
            className="rounded-2xl btn-hawkeye"
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) {
                w.document.write(htmlReport);
                w.document.close();
              }
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            In / PDF báo cáo CFA
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] text-zinc-600">
        <Shield className="w-3.5 h-3.5" />
        <span>Mô hình định lượng tham khảo — không phải khuyến nghị đầu tư.</span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[9px] text-zinc-600 uppercase">{label}</p>
      <p className="text-sm font-mono text-white mt-0.5">{value}</p>
      {sub && <p className="text-[9px] text-zinc-600 mt-0.5 truncate">{sub}</p>}
    </div>
  );
}
