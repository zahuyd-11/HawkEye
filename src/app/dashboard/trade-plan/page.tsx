"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Shield,
  Brain,
  ChevronDown,
  CheckCircle2,
  Plus,
  FileText,
  Cpu,
  Radar,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { formatVnd, parseCapitalInput, formatCapitalInput } from "@/lib/behavioral-dna";

interface TradePlan {
  id: string;
  name: string;
  ticker: string | null;
  status: string;
  updatedAt: string;
}

const RETAIL_ALLOCATION = [
  { name: "Growth Assets", pct: 45, color: "#38bdf8" },
  { name: "Defensive Assets", pct: 25, color: "#34d399" },
  { name: "Cash Buffer", pct: 30, color: "#a1a1aa" },
] as const;

const STEPS = [
  { id: 1, title: "Quy mô dòng vốn", icon: Wallet, desc: "Nhập vốn khả dụng (VND)" },
  { id: 2, title: "Ngưỡng cắt lỗ drawdown", icon: Shield, desc: "Maximum Drawdown NAV" },
  { id: 3, title: "Thiên lệch tâm lý hành vi", icon: Brain, desc: "Phản ứng khi cổ phiếu lõi -12%" },
] as const;

export default function TradePlanPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [capitalInput, setCapitalInput] = useState("1,000,000,000");
  const [maxDrawdown, setMaxDrawdown] = useState(-15);
  const [biasScenario, setBiasScenario] = useState("");
  const [showGenome, setShowGenome] = useState(false);
  const [guardActive, setGuardActive] = useState(false);
  const [tradePlans, setTradePlans] = useState<TradePlan[]>([]);
  const [showJournal, setShowJournal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hawkeye_retail_genome");
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      if (p.capitalInput) setCapitalInput(p.capitalInput);
      if (p.maxDrawdown) setMaxDrawdown(p.maxDrawdown);
      if (p.biasScenario) setBiasScenario(p.biasScenario);
      if (p.showGenome) {
        setShowGenome(true);
        setGuardActive(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetch("/api/trade-plan")
      .then((r) => r.json())
      .then((data) => setTradePlans(Array.isArray(data) ? data : []))
      .catch(() => setTradePlans([]));
  }, []);

  const capital = parseCapitalInput(capitalInput);

  const goNext = (from: number) => {
    if (from === 1 && capital <= 0) return;
    if (from === 2 && !biasScenario) {
      setActiveStep(3);
      return;
    }
    setActiveStep(from + 1);
  };

  const activateGenome = () => {
    if (!biasScenario) {
      setActiveStep(3);
      return;
    }
    setShowGenome(true);
    setGuardActive(true);
    localStorage.setItem(
      "hawkeye_retail_genome",
      JSON.stringify({ capitalInput, maxDrawdown, biasScenario, showGenome: true })
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0C] text-[#E4E4E7] pb-16">
      <div className="absolute top-0 left-1/3 w-[480px] h-[320px] bg-sky-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <main className="container max-w-2xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8 border-b border-white/[0.04] pb-6">
          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-2xl">
            RETAIL WORKSPACE
          </span>
          <h1 className="text-xl font-semibold text-white mt-3">Trade Plan — từng bước một</h1>
          <p className="text-zinc-500 text-sm mt-1">Chỉ mở một bước tại một thời điểm.</p>
        </div>

        <div className="space-y-3">
          {STEPS.map((step) => {
            const isOpen = activeStep === step.id;
            const Icon = step.icon;
            const done =
              (step.id === 1 && capital > 0) ||
              (step.id === 2 && maxDrawdown < 0) ||
              (step.id === 3 && !!biasScenario);

            return (
              <div
                key={step.id}
                className="bg-[#121214]/50 border border-white/[0.04] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(isOpen ? 0 : step.id)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isOpen ? "bg-sky-500/10 text-sky-400" : "bg-white/[0.04] text-zinc-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                        Bước {step.id}: {step.title}
                        {done && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 border-t border-white/[0.04]"
                    >
                      {step.id === 1 && (
                        <div className="pt-4 space-y-3">
                          <input
                            type="text"
                            value={capitalInput}
                            onChange={(e) =>
                              setCapitalInput(formatCapitalInput(e.target.value.replace(/\D/g, "")))
                            }
                            className="w-full bg-[#0D0D0C] border border-white/[0.06] rounded-2xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-sky-500/40"
                            placeholder="Nhập VND..."
                          />
                          <p className="text-[10px] text-zinc-500 font-mono">≈ {formatVnd(capital)}</p>
                          <Button
                            type="button"
                            onClick={() => goNext(1)}
                            disabled={capital <= 0}
                            className="w-full rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      )}
                      {step.id === 2 && (
                        <div className="pt-4 space-y-3 font-mono text-xs">
                          <div className="flex justify-between text-zinc-400">
                            <span>Ngưỡng cắt lỗ tối đa</span>
                            <span className="text-rose-400 font-bold">{maxDrawdown}%</span>
                          </div>
                          <input
                            type="range"
                            min={-40}
                            max={-5}
                            value={maxDrawdown}
                            onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1.5 bg-white/[0.06] rounded-full"
                          />
                          <Button
                            type="button"
                            onClick={() => goNext(2)}
                            className="w-full rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      )}
                      {step.id === 3 && (
                        <div className="pt-4 space-y-3">
                          <select
                            value={biasScenario}
                            onChange={(e) => setBiasScenario(e.target.value)}
                            className="w-full bg-[#0D0D0C] border border-white/[0.06] rounded-2xl px-3 py-3 text-xs text-zinc-300 focus:outline-none focus:border-sky-500/40"
                          >
                            <option value="">Khi cổ phiếu lõi giảm -12%, bạn sẽ...</option>
                            <option value="fomo">Mua thêm (FOMO)</option>
                            <option value="panic">Bán tháo cắt lỗ</option>
                            <option value="hold">Giữ vị thế, nhờ AI giám sát</option>
                          </select>
                          <Button
                            onClick={activateGenome}
                            disabled={!biasScenario}
                            className="w-full h-11 rounded-2xl bg-sky-600/90 hover:bg-sky-500 text-white font-mono text-xs"
                          >
                            <Cpu className="h-4 w-4 mr-2" />
                            Tính phân bổ & xem báo cáo
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {showGenome && capital > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-[#121214]/50 border border-white/[0.04] rounded-2xl p-6 space-y-5"
            >
              <div className="border-b border-white/[0.06] pb-3">
                <span className="text-[10px] font-mono text-sky-400">INVESTOR GENOME REPORT</span>
                <h3 className="text-sm font-semibold text-white mt-1">Phân bổ chuẩn F0</h3>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Vốn {formatVnd(capital)} · Drawdown {maxDrawdown}%
                </p>
              </div>

              <div className="flex h-2.5 rounded-full overflow-hidden bg-white/[0.06]">
                {RETAIL_ALLOCATION.map((a) => (
                  <div key={a.name} style={{ width: `${a.pct}%`, backgroundColor: a.color }} />
                ))}
              </div>

              <div className="space-y-2 font-mono text-xs">
                {RETAIL_ALLOCATION.map((row) => (
                  <div
                    key={row.name}
                    className="flex justify-between py-2 border-b border-white/[0.04] last:border-0"
                  >
                    <span className="text-zinc-500">
                      {row.name} ({row.pct}%)
                    </span>
                    <span className="text-white font-semibold">
                      {formatVnd(Math.round((row.pct / 100) * capital))}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  guardActive
                    ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                    : "border-white/[0.04] bg-white/[0.02]"
                }`}
              >
                <Radar
                  className={`w-4 h-4 shrink-0 ${guardActive ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`}
                />
                <div>
                  <p className="text-[10px] font-mono text-emerald-400">AI GUARD MONITOR</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {guardActive
                      ? "Đang giám sát drawdown & cảnh báo hành vi — trạng thái ACTIVE"
                      : "Chờ kích hoạt"}
                  </p>
                </div>
              </div>

              <Link href="/dashboard/deal-digest">
                <Button
                  variant="outline"
                  className="w-full text-xs font-mono border-white/[0.06] text-zinc-400 hover:text-white rounded-2xl"
                >
                  Mở Deal Digest
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/dashboard/trade-plan/new">
            <Button size="sm" className="bg-sky-600/90 hover:bg-sky-500 text-white font-mono text-xs rounded-2xl">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              TradePlan mới
            </Button>
          </Link>
        </div>

        <div className="mt-10 bg-[#121214]/50 border border-white/[0.04] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowJournal(!showJournal)}
            className="w-full px-5 py-4 flex justify-between items-center text-left"
          >
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              NHẬT KÝ ({tradePlans.length})
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 ${showJournal ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showJournal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="border-t border-white/[0.04] px-5 pb-5"
              >
                {tradePlans.length === 0 ? (
                  <p className="text-xs text-zinc-600 py-6 text-center font-mono">Chưa có kế hoạch.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-[11px] font-mono">
                    {tradePlans.map((p) => (
                      <li
                        key={p.id}
                        className="flex justify-between text-zinc-400 border-b border-white/[0.04] pb-2"
                      >
                        <span className="text-white">
                          {p.name} ({p.ticker ?? "—"})
                        </span>
                        <span>{p.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
