"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Shield,
  Upload,
  Coins,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VN30_RISK_DESK_REPORTS, type RiskDeskReport } from "@/data/risk-desk-catalog";

function RiskDeskContent() {
  const searchParams = useSearchParams();
  const scan = searchParams.get("scan")?.toUpperCase() ?? "";
  const [searchTerm, setSearchTerm] = useState(scan);
  const [reports] = useState<RiskDeskReport[]>(VN30_RISK_DESK_REPORTS);
  const [uploadNote, setUploadNote] = useState("");
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (scan) setSearchTerm(scan);
  }, [scan]);

  useEffect(() => {
    fetch("/api/openclaw/vn30")
      .then((r) => r.json())
      .then((d) => {
        if (d.lastIngestAt) {
          setIngestStatus(
            `OpenClaw VN30: ${d.ingestStatus} · ${new Date(d.lastIngestAt).toLocaleString("vi-VN")} · ${Object.keys(d.quotes ?? {}).length} mã`
          );
        } else {
          setIngestStatus("OpenClaw VN30: chưa ingest — cron T2–T6 02:00 hoặc gọi POST /api/openclaw/vn30");
        }
      })
      .catch(() => setIngestStatus(null));
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.ticker.includes(searchTerm.toUpperCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    setUploadNote(
      "Tính năng HE Token & upload dự án sẽ kích hoạt sau khi ví token được cấu hình. Liên hệ hawkeye.contact@gmail.com để early access."
    );
  };

  return (
    <div className="min-h-screen text-[#E4E4E7] relative">
      <main className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        <header className="mb-10">
          <span className="text-[10px] font-mono text-hawkeye-glow bg-hawkeye-navy-mid/40 px-3 py-1 rounded-2xl border border-hawkeye-glow/20">
            HAWKEYE INTELLIGENCE RISK DESK
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mt-4 text-gradient-hawkeye">
            Trạm thẩm định rủi ro & phân tích doanh nghiệp
          </h1>
          <p className="text-sm text-zinc-500 mt-3 max-w-2xl leading-relaxed">
            Báo cáo 1 trang chuẩn CFA — DCF FCFF 5 năm (WACC, Gordon TV), DuPont, phân mảng doanh thu.
            Dữ liệu giá VN30 cập nhật qua OpenClaw crawler (Yahoo .VN / VNDirect).
          </p>
          {ingestStatus && (
            <p className="text-[10px] font-mono text-hawkeye-glow/80 mt-2">{ingestStatus}</p>
          )}
        </header>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã VN30 (HPG, DGW, FPT...)"
            className="pl-10 bg-hawkeye-panel border-white/[0.06] rounded-2xl"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-hawkeye-glow" />
            Báo cáo định kỳ VN30 (Free)
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="obsidian-glass rounded-2xl p-5 border-hawkeye-glow flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-bold text-white">{r.ticker}</p>
                    <p className="text-xs text-zinc-500">{r.companyName}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-1 rounded-lg ${
                      r.signal === "Buy"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : r.signal === "Sell"
                          ? "bg-rose-500/15 text-rose-400"
                          : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {r.signal}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed flex-1">{r.summary}</p>

                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-white/[0.04]">
                  {r.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <p className="text-[9px] text-zinc-600 uppercase">{m.label}</p>
                      <p className="text-xs font-mono text-hawkeye-glow-bright mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-zinc-600 font-mono mb-4">{r.chartHint}</p>

                <div className="flex gap-2 mt-auto">
                  <Link href={`/dashboard/risk-desk/${r.ticker}`} className="flex-1">
                    <Button className="w-full rounded-2xl btn-hawkeye text-xs h-9">
                      Báo cáo CFA / DCF
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/risk-desk/${r.ticker}`}>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/[0.06] text-xs h-9 px-3"
                      title="In PDF từ trang báo cáo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <p className="text-[9px] text-zinc-600 mt-2">
                  Cập nhật: {new Date(r.publishedAt).toLocaleDateString("vi-VN")}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="obsidian-glass rounded-2xl p-6 border-hawkeye-glow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Trạm thẩm định dự án & hợp đồng (HE Token)
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Upload BCTC, term sheet, memo IPO — HawkEye Risk Model phân tích độc quyền
              </p>
            </div>
          </div>

          <div
            className="border border-dashed border-hawkeye-glow/25 rounded-2xl p-8 text-center bg-hawkeye-obsidian/40 cursor-pointer hover:border-hawkeye-glow/40 transition-colors"
            onClick={handleUpload}
            onKeyDown={(e) => e.key === "Enter" && handleUpload()}
            role="button"
            tabIndex={0}
          >
            <Upload className="w-8 h-8 text-hawkeye-glow mx-auto mb-3" />
            <p className="text-sm text-zinc-300">Kéo thả file hoặc bấm để chọn tài liệu</p>
            <p className="text-[10px] text-zinc-600 mt-2">
              PDF, Excel, Word · Tiêu thụ HE Token theo độ phức tạp báo cáo
            </p>
          </div>
          {uploadNote && (
            <p className="text-xs text-amber-400/90 mt-4 text-center font-mono">{uploadNote}</p>
          )}
        </section>

        <div className="mt-8 flex items-center gap-2 text-[10px] text-zinc-600">
          <Shield className="w-3.5 h-3.5" />
          <span>
            Mô hình rủi ro HawkEye — không phải khuyến nghị mua bán. Báo cáo mang tính tham khảo
            định lượng.
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function RiskDeskPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-zinc-500 text-sm">
          Đang tải Risk Desk...
        </div>
      }
    >
      <RiskDeskContent />
    </Suspense>
  );
}
