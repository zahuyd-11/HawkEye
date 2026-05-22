"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Layers,
  Clock,
  Target,
  Shield,
  Brain,
  Activity,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Radar,
  LifeBuoy,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CURRENCIES,
  formatCapitalInput,
  formatMoney,
  parseCapitalInput,
  type SupportedCurrency,
} from "@/lib/currency";
import { RETAIL_LEGAL_DISCLAIMER } from "@/lib/compliance/disclaimer";
import {
  buildProfileFromBody,
  buildFallbackGenome,
  type InvestorGenomeReport,
  type AssetPreference,
  type TimelineHorizon,
  type InvestmentGoal,
  type BehavioralBias,
  type MarketCheckFrequency,
} from "@/lib/quant/trade-plan-v6";
import { requiredGainToRecover, DRAWDOWN_GUIDE, suggestDrawdown } from "@/lib/quant/recovery";

const TOTAL_STEPS = 8;

const ASSET_OPTIONS: { id: AssetPreference; label: string }[] = [
  { id: "stocks", label: "Cổ phiếu" },
  { id: "etf", label: "Quỹ chỉ số (ETF)" },
  { id: "bonds", label: "Trái phiếu" },
  { id: "real_estate", label: "Bất động sản" },
  { id: "gold", label: "Vàng" },
  { id: "commodities", label: "Hàng hóa / Dầu" },
  { id: "forex", label: "Ngoại hối (Forex)" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
};

export default function TradePlanPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [currency, setCurrency] = useState<SupportedCurrency>("VND");
  const [capitalInput, setCapitalInput] = useState("1,000,000,000");
  const [assetPrefs, setAssetPrefs] = useState<AssetPreference[]>(["stocks", "etf"]);
  const [timeline, setTimeline] = useState<TimelineHorizon | "">("");
  const [goal, setGoal] = useState<InvestmentGoal | "">("");
  const [maxDrawdown, setMaxDrawdown] = useState(-15);
  const [behavioralBias, setBehavioralBias] = useState<BehavioralBias | "">("");
  const [marketCheckFrequency, setMarketCheckFrequency] = useState<MarketCheckFrequency | "">("");
  const [userOpenNotes, setUserOpenNotes] = useState("");
  const [genome, setGenome] = useState<InvestorGenomeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [rescueInput, setRescueInput] = useState("");
  const [rescueResult, setRescueResult] = useState<string[] | null>(null);
  const [rescueLoading, setRescueLoading] = useState(false);

  const capital = parseCapitalInput(capitalInput);
  const recoveryPct = requiredGainToRecover(maxDrawdown);

  const toggleAsset = (id: AssetPreference) => {
    setAssetPrefs((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]
    );
  };

  const buildPayload = () => ({
    totalCapital: capital,
    currency,
    assetPreferences: assetPrefs,
    timeline,
    goal,
    maxDrawdown,
    behavioralBias,
    marketCheckFrequency,
    userOpenNotes,
  });

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return capital > 0;
      case 2:
        return assetPrefs.length > 0;
      case 3:
        return timeline !== "";
      case 4:
        return goal !== "";
      case 5:
        return true;
      case 6:
        return behavioralBias !== "";
      case 7:
        return marketCheckFrequency !== "";
      case 8:
        return true;
      default:
        return false;
    }
  };

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    if (next === 5 && goal && timeline) {
      setMaxDrawdown(suggestDrawdown(goal, timeline));
    }
  };

  const submitGenome = async () => {
    const payload = buildPayload();
    const profile = buildProfileFromBody(payload);
    if (!profile) return;

    setLoading(true);
    setNotice("");

    const runLocal = () => {
      setGenome(buildFallbackGenome(profile));
      setNotice(
        session
          ? "HawkEye AI Core — mô phỏng cục bộ (engine định lượng)."
          : "Mô phỏng cục bộ. Đăng nhập /auth/signin để đồng bộ HawkEye AI Core."
      );
    };

    try {
      const res = await fetch("/api/quant/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 401) {
        runLocal();
        return;
      }

      if (!res.ok) {
        runLocal();
        setNotice(data.error || "Engine tạm dùng mô phỏng cục bộ.");
        return;
      }

      setGenome(data.data);
      setNotice("Báo cáo từ HawkEye AI Core · " + (data.mode === "hawkeye-ai-core" ? "cloud" : "local"));
    } catch {
      runLocal();
      setNotice("Không kết nối server — dùng engine định lượng cục bộ.");
    } finally {
      setLoading(false);
    }
  };

  const runRescue = async () => {
    if (!rescueInput.trim()) return;
    setRescueLoading(true);
    const payload = { distressNarrative: rescueInput, behavioralBias };
    try {
      const res = await fetch("/api/quant/problem-solving", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.remediationChecklist) {
        setRescueResult(data.remediationChecklist);
      } else if (res.status === 401) {
        setRescueResult([
          "Giảm tỷ trọng mã lõi xuống dưới 25% NAV",
          "Duy trì cash buffer ≥ 25% cho đến khi xác nhận xu hướng",
          "Đăng nhập để chạy HawkEye Risk Desk phân tích sâu",
        ]);
      }
    } catch {
      setRescueResult(["Không thể kết nối HawkEye AI Core — thử lại sau."]);
    } finally {
      setRescueLoading(false);
    }
  };

  const stepMeta = [
    { icon: Wallet, title: "Quy mô dòng vốn", sub: "Chọn loại tiền & nhập số vốn khả dụng" },
    { icon: Layers, title: "Khẩu vị tài sản", sub: "Danh mục đầu tư đa lớp tài sản" },
    { icon: Clock, title: "Khung thời gian", sub: "Ngắn · Trung · Dài hạn" },
    { icon: Target, title: "Mục tiêu tài chính", sub: "Tích sản · Xoay vốn · Trang trải đời sống" },
    { icon: Shield, title: "Ngưỡng sụt giảm", sub: "Drawdown & công thức hồi vốn CFA" },
    { icon: Brain, title: "Thiên lệch hoảng loạn", sub: "Phản ứng khi danh mục -12%" },
    { icon: Activity, title: "Tần suất theo dõi", sub: "Nhịp kiểm tra danh mục" },
    { icon: MessageSquareText, title: "Câu chuyện của bạn", sub: "Lớp ngữ cảnh cá nhân hóa" },
  ];

  const Meta = stepMeta[step - 1];
  const StepIcon = Meta?.icon ?? Wallet;

  return (
    <div className="min-h-screen text-[#E4E4E7] pb-20 relative">
      <div className="absolute top-0 right-0 w-[420px] h-[300px] bg-hawkeye-glow/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-lg mx-auto px-4 py-10 relative z-10">
        <header className="mb-8 text-center">
          <span className="text-[10px] font-mono text-hawkeye-glow bg-hawkeye-navy-mid/50 px-3 py-1 rounded-2xl border border-hawkeye-glow/20">
            TRADE PLAN BUILDER v6
          </span>
          <h1 className="text-xl font-semibold text-white mt-4">Investor Behavioral DNA</h1>
          <p className="text-zinc-500 text-xs mt-2">
            Bước {step}/{TOTAL_STEPS} · HawkEye AI Core
          </p>
          <div className="flex gap-1 justify-center mt-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i + 1 <= step ? "w-5 bg-hawkeye-glow" : "w-2 bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
        </header>

        {!genome ? (
          <div className="obsidian-glass rounded-2xl p-6 min-h-[340px] flex flex-col border-hawkeye-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-hawkeye-glow/10 text-hawkeye-glow">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">{Meta?.title}</h2>
                <p className="text-[11px] text-zinc-500">{Meta?.sub}</p>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {step === 1 && (
                    <>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                        className="w-full bg-hawkeye-obsidian/80 border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white focus:border-hawkeye-glow/40"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={capitalInput}
                        onChange={(e) =>
                          setCapitalInput(formatCapitalInput(e.target.value.replace(/\D/g, "")))
                        }
                        className="w-full bg-hawkeye-obsidian/80 border border-white/[0.06] rounded-2xl px-4 py-4 font-mono text-lg text-white text-center focus:border-hawkeye-glow/40"
                      />
                      <p className="text-center text-[11px] text-zinc-500 font-mono">
                        ≈ {formatMoney(capital, currency)}
                      </p>
                    </>
                  )}

                  {step === 2 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {ASSET_OPTIONS.map((o) => {
                        const on = assetPrefs.includes(o.id);
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => toggleAsset(o.id)}
                            className={`px-3 py-2 rounded-2xl text-[11px] border transition-all ${
                              on
                                ? "bg-hawkeye-glow/15 border-hawkeye-glow/30 text-hawkeye-glow-bright"
                                : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-2">
                      {[
                        { id: "short" as const, label: "Ngắn hạn (< 3 tháng)" },
                        { id: "medium" as const, label: "Trung hạn (3 tháng – 1 năm)" },
                        { id: "long" as const, label: "Dài hạn (> 1 năm)" },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setTimeline(o.id)}
                          className={`w-full text-left px-4 py-3 rounded-2xl border text-xs ${
                            timeline === o.id
                              ? "border-hawkeye-glow/30 bg-hawkeye-glow/10 text-white"
                              : "border-white/[0.06] text-zinc-400"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-2">
                      {[
                        { id: "accumulate" as const, label: "Tích sản dài hạn" },
                        {
                          id: "fast_rotation" as const,
                          label: "Xoay vòng vốn nhanh (rủi ro cao)",
                        },
                        {
                          id: "lifestyle_income" as const,
                          label: "Thu nhập trang trải cuộc sống (du lịch, mua sắm, chi tiêu định kỳ)",
                        },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setGoal(o.id)}
                          className={`w-full text-left px-4 py-3 rounded-2xl border text-xs leading-relaxed ${
                            goal === o.id
                              ? "border-hawkeye-glow/30 bg-hawkeye-glow/10 text-white"
                              : "border-white/[0.06] text-zinc-400"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Ngưỡng sụt giảm tối đa</span>
                        <span className="text-rose-400 font-bold">{maxDrawdown}%</span>
                      </div>
                      <input
                        type="range"
                        min={-40}
                        max={-5}
                        step={1}
                        value={maxDrawdown}
                        onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                        className="w-full accent-hawkeye-glow h-2 bg-white/[0.06] rounded-full"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-600 px-0.5">
                        {DRAWDOWN_GUIDE.map((g) => (
                          <span key={g.pct} className="text-center w-[18%]">
                            {g.pct}%
                          </span>
                        ))}
                      </div>
                      <div className="obsidian-glass rounded-2xl p-4 border border-hawkeye-glow/15">
                        <p className="text-hawkeye-glow-bright font-semibold text-sm">
                          Cần +{recoveryPct}% lãi để hòa vốn
                        </p>
                        <p className="text-zinc-500 text-[10px] mt-1 leading-relaxed">
                          Công thức CFA: Required Gain = (1 ÷ (1 − |drawdown|)) − 1. Ví dụ lỗ 20% cần
                          +25% để về điểm xuất phát.
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-2">
                          Gợi ý cho hồ sơ của bạn: {suggestDrawdown(goal || "accumulate", timeline || "medium")}%
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="space-y-2 text-xs">
                      <p className="text-zinc-500 text-[11px] mb-2">
                        Danh mục lõi giảm -12% vì tin đồn vĩ mô — bạn sẽ?
                      </p>
                      {[
                        { id: "panic" as const, label: "A. Bán tháo cắt lỗ ngay" },
                        { id: "fomo" as const, label: "B. Mua thêm all-in trung bình giá" },
                        { id: "hold" as const, label: "C. Giữ vị thế — nhờ HawkEye kiểm toán" },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setBehavioralBias(o.id)}
                          className={`w-full text-left px-4 py-3 rounded-2xl border ${
                            behavioralBias === o.id
                              ? "border-hawkeye-glow/30 bg-hawkeye-glow/10 text-white"
                              : "border-white/[0.06] text-zinc-400"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 7 && (
                    <div className="flex flex-col gap-3">
                      {[
                        { id: "calm" as const, label: "1–2 lần / ngày (nhà đầu tư điềm tĩnh)" },
                        { id: "emotional" as const, label: "Liên tục trong phiên (rủi ro overtrading)" },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setMarketCheckFrequency(o.id)}
                          className={`w-full px-4 py-3.5 rounded-2xl border text-xs ${
                            marketCheckFrequency === o.id
                              ? "border-hawkeye-glow/30 bg-hawkeye-glow/10 text-white"
                              : "border-white/[0.06] text-zinc-400"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 8 && (
                    <textarea
                      value={userOpenNotes}
                      onChange={(e) => setUserOpenNotes(e.target.value)}
                      rows={6}
                      placeholder="Hãy chia sẻ thêm về câu chuyện tài chính, khó khăn hoặc mục tiêu cụ thể của bạn để hệ thống cá nhân hóa sâu..."
                      className="w-full bg-hawkeye-obsidian/80 border border-white/[0.06] rounded-2xl px-4 py-3 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-hawkeye-glow/40 resize-none leading-relaxed"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {notice && (
              <p className="text-[10px] text-amber-400/90 text-center mt-3 font-mono">{notice}</p>
            )}

            <div className="flex gap-2 mt-6 pt-4 border-t border-white/[0.04]">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => go(step - 1)}
                  className="rounded-2xl border-white/[0.06]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  disabled={!canAdvance()}
                  onClick={() => go(step + 1)}
                  className="flex-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs"
                >
                  Tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={loading}
                  onClick={submitGenome}
                  className="flex-1 rounded-2xl btn-hawkeye text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      HawkEye AI Core đang tính...
                    </>
                  ) : (
                    "Kích hoạt Investor Genome"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="obsidian-glass rounded-2xl p-6 space-y-5 border-hawkeye-glow">
              <div>
                <span className="text-[10px] font-mono text-hawkeye-glow">INVESTOR GENOME REPORT</span>
                <h3 className="text-base font-semibold text-white mt-1">{genome.profileTitle}</h3>
                <p className="text-[11px] text-zinc-500 mt-1">{genome.profileDesc}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-2">
                  {genome.regimeDetected} · {genome.methodology} · {genome.currency}
                </p>
              </div>

              <div className="flex h-2.5 rounded-full overflow-hidden bg-white/[0.06]">
                {genome.allocation.map((a) => (
                  <div key={a.name} style={{ width: `${a.pct}%`, backgroundColor: a.color }} />
                ))}
              </div>

              <div className="space-y-2 font-mono text-xs">
                {genome.allocation.map((row) => (
                  <div key={row.name} className="flex justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-zinc-500">
                      {row.name} ({row.pct}%)
                    </span>
                    <span className="text-white font-semibold">
                      {formatMoney(row.amount, genome.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-hawkeye-glow/90 font-mono">
                Hồi vốn sau drawdown: cần +{genome.recoveryGainPct}% lãi
              </p>

              {genome.technicalLevels && (
                <div className="bg-hawkeye-obsidian/80 border border-hawkeye-glow/20 rounded-2xl p-4 font-mono text-[11px] space-y-1">
                  <p className="text-hawkeye-glow font-semibold">
                    Kỹ thuật · {genome.technicalLevels.primaryTicker}
                  </p>
                  <p className="text-zinc-400">
                    Entry {genome.technicalLevels.entryPrice.toLocaleString()} · SL{" "}
                    {genome.technicalLevels.stopLoss.toLocaleString()} · TP{" "}
                    {genome.technicalLevels.takeProfit.toLocaleString()}
                  </p>
                </div>
              )}

              <ul className="text-[11px] text-zinc-500 space-y-1">
                {genome.behavioralInsights.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06]">
                <Radar className="w-4 h-4 text-emerald-400 animate-pulse" />
                <p className="text-[11px] text-zinc-400">{genome.activeAIModes.join(" · ")}</p>
              </div>

              <button
                type="button"
                onClick={() => setGenome(null)}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
              >
                Làm lại khảo sát
              </button>
            </div>

            <div className="obsidian-glass rounded-2xl p-5 border-hawkeye-glow">
              <div className="flex items-center gap-2 mb-3">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Portfolio Rescue</span>
              </div>
              <textarea
                value={rescueInput}
                onChange={(e) => setRescueInput(e.target.value)}
                rows={3}
                placeholder='VD: "Mua HPG 34,000, chiếm 60% vốn, hiện lỗ 15%"'
                className="w-full bg-hawkeye-obsidian/80 border border-white/[0.06] rounded-2xl px-3 py-2 text-xs text-zinc-300 mb-2 resize-none"
              />
              <Button
                onClick={runRescue}
                disabled={rescueLoading}
                className="w-full rounded-2xl border border-amber-500/30 bg-amber-600/15 text-amber-100 text-xs hover:bg-amber-600/25"
              >
                {rescueLoading ? "HawkEye AI Core..." : "Phân tích cứu danh mục"}
              </Button>
              {rescueResult && (
                <ul className="mt-3 space-y-1 text-[11px] text-zinc-400">
                  {rescueResult.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/dashboard/risk-desk">
              <Button variant="outline" className="w-full rounded-2xl border-white/[0.06] text-xs">
                Mở HawkEye Risk Desk
              </Button>
            </Link>
          </motion.div>
        )}

        <p className="text-[9px] text-zinc-600 leading-relaxed mt-8 text-center px-2">
          {RETAIL_LEGAL_DISCLAIMER}
        </p>
      </main>

      <Footer />
    </div>
  );
}
