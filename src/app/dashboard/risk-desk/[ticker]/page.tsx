"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { CfaRiskReportView } from "@/components/risk-desk/CfaRiskReportView";
import type { CfaRiskReport } from "@/lib/quant/cfa-risk-report";

export default function RiskDeskTickerPage() {
  const params = useParams();
  const ticker = String(params.ticker ?? "HPG").toUpperCase();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<CfaRiskReport | null>(null);
  const [htmlReport, setHtmlReport] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/risk-desk/report?ticker=${encodeURIComponent(ticker)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load report");
        setReport(data.report);
        setHtmlReport(data.htmlReport);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải báo cáo"))
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="min-h-screen text-[#E4E4E7]">
      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading && (
          <p className="text-sm text-zinc-500 text-center py-20">Đang tính DCF & OpenClaw...</p>
        )}
        {error && (
          <p className="text-sm text-rose-400 text-center py-20">{error}</p>
        )}
        {report && <CfaRiskReportView report={report} htmlReport={htmlReport} />}
      </main>
      <Footer />
    </div>
  );
}
