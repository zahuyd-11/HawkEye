"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  MessageCircle,
  Shield,
  Sparkles,
  Search,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingComparison } from "@/components/pricing/PricingComparison";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const RIBBON = [
  { l: "VNINDEX", v: "+1.28%", c: "text-emerald-400" },
  { l: "THỊ TRƯỜNG", v: "Mở rộng (Risk-On)", c: "text-emerald-400" },
  { l: "THANH KHOẢN", v: "+14.2%", c: "text-sky-400" },
  { l: "NGÂN HÀNG", v: "Tích lũy mạnh", c: "text-emerald-400" },
  { l: "DÒNG NGOẠI", v: "Net mua +420 tỷ", c: "text-sky-400" },
];

export default function HomePage() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const ribbonItems = [...RIBBON, ...RIBBON];

  const handleTickerScan = (e: React.FormEvent) => {
    e.preventDefault();
    const code = ticker.trim().toUpperCase();
    if (code) {
      router.push(`/dashboard/deal-digest?scan=${code}`);
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0C] text-[#E4E4E7] font-sans antialiased relative overflow-hidden selection:bg-sky-500/20">
      <div className="w-full h-10 bg-[#121214]/50 border-b border-white/[0.04] flex items-center overflow-hidden z-40 backdrop-blur-md">
        <div className="flex animate-marquee whitespace-nowrap gap-16 text-[10px] font-mono tracking-widest text-zinc-500 uppercase px-4">
          {ribbonItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item.l} <span className={`font-bold ${item.c}`}>{item.v}</span>
            </span>
          ))}
        </div>
      </div>

      <Header />

      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-b from-sky-500/[0.07] to-transparent rounded-full blur-[120px] pointer-events-none" />

      <motion.section
        className="max-w-3xl mx-auto px-6 pt-24 pb-20 relative z-10 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121214]/60 border border-white/[0.06] rounded-2xl backdrop-blur-md mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            AI Investment Companion · Freemium
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-white leading-[1.15]"
        >
          Người đồng hành AI
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
            cho hành trình đầu tư của bạn
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mt-6 leading-relaxed"
        >
          Dành cho nhà đầu tư cá nhân (F0, 16–40 tuổi): đọc luận điểm rõ ràng, quét mã cổ phiếu,
          lập kế hoạch vốn — không lưới gạch, không quá tải thị giác.
        </motion.p>

        <motion.form
          variants={fadeInUp}
          onSubmit={handleTickerScan}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Nhập mã cổ phiếu để quét AI..."
              className="w-full pl-11 pr-4 py-4 bg-[#121214]/90 border border-white/[0.06] rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-sky-500/30 focus:shadow-[0_0_24px_rgba(56,189,248,0.08)] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-4 bg-sky-600/90 hover:bg-sky-500 text-white text-sm font-medium rounded-2xl shadow-[0_0_32px_rgba(56,189,248,0.12)] hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] transition-all inline-flex items-center justify-center gap-2"
          >
            Quét AI
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.form>

        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/dashboard/trade-plan">
            <span className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] text-zinc-300 text-xs rounded-2xl hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer inline-flex items-center gap-2">
              Lập Trade Plan
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
          <Link href="/auth/signup">
            <span className="px-5 py-2.5 text-zinc-500 text-xs hover:text-zinc-300 transition-colors cursor-pointer">
              Dùng miễn phí — Mini
            </span>
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        className="border-y border-white/[0.04] py-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: MessageCircle,
              title: "AI Wealth Companion",
              desc: "Chat thân thiện — Thesis, Catalysts, Risks kèm thanh độ tin cậy.",
            },
            {
              icon: BarChart3,
              title: "Deal Digest",
              desc: "Báo cáo DCF 5 năm chuẩn CFA từ snapshot doanh nghiệp.",
            },
            {
              icon: Shield,
              title: "Trade Plan DNA",
              desc: "Khảo sát từng bước — phân bổ vốn VND trực quan cho F0.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="obsidian-glass rounded-2xl p-6 hover:border-white/[0.1] transition-colors"
            >
              <Icon className="w-5 h-5 text-sky-400 mb-4" />
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="max-w-5xl mx-auto px-6 py-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={fadeInUp}
      >
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h2 className="text-xl font-semibold text-white">Gói Freemium</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { name: "Mini", price: "0₫", perks: ["AI Companion cơ bản", "1 quét Deal Digest/tuần"] },
            {
              name: "Plus",
              price: "99k/tháng",
              perks: ["Deal Digest không giới hạn", "Trade Plan DNA"],
              highlight: true,
            },
            { name: "Pro", price: "249k/tháng", perks: ["Committee API", "Báo cáo PDF xuất"] },
          ].map((t) => (
            <div
              key={t.name}
              className={`obsidian-glass rounded-2xl p-6 ${
                t.highlight ? "border-sky-500/20 shadow-[0_0_40px_rgba(56,189,248,0.06)]" : ""
              }`}
            >
              <p className="text-[10px] font-mono text-zinc-500 uppercase">{t.name}</p>
              <p className="text-2xl font-bold text-white mt-2">{t.price}</p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-500">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <PricingComparison />
      </motion.section>

      <section className="border-t border-white/[0.04] py-20 relative z-10">
        <motion.div
          className="max-w-xl mx-auto px-6 text-center space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-semibold text-white">Bắt đầu miễn phí hôm nay</h2>
          <p className="text-sm text-zinc-500">Quỹ lớn & Family Office — sẽ có trên Roadmap.</p>
          <Link href="/auth/signup">
            <span className="inline-flex px-8 py-4 bg-sky-600/90 hover:bg-sky-500 text-white text-sm rounded-2xl items-center gap-2 shadow-[0_0_32px_rgba(56,189,248,0.15)] hover:shadow-[0_0_48px_rgba(56,189,248,0.25)] transition-all cursor-pointer">
              Tạo tài khoản Mini
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
