"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

interface InsightBlocks {
  thesis: string;
  catalysts: string;
  risks: string;
  confidence: number;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  blocks?: InsightBlocks;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<Message[]>([
    {
      sender: "ai",
      text: "Xin chào! Mình là HawkEye — người đồng hành AI cho hành trình đầu tư của bạn. Hỏi mã cổ phiếu hoặc chủ đề thị trường nhé!",
    },
  ]);

  const dispatchQuery = async () => {
    if (!query.trim() || isLoading) return;
    const userText = query.trim();
    setQuery("");
    setStream((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      if (res.status === 401) {
        setStream((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Bạn cần đăng nhập tại /auth/signin để dùng AI Wealth Companion.",
          },
        ]);
        return;
      }

      if (res.ok && data.thesis) {
        setStream((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.replyText || "Đây là phân tích nhanh cho bạn:",
            blocks: {
              thesis: data.thesis,
              catalysts: data.catalysts,
              risks: data.risks,
              confidence: data.confidence ?? 50,
            },
          },
        ]);
      } else {
        setStream((prev) => [
          ...prev,
          { sender: "ai", text: data.error || "Không thể xử lý yêu cầu." },
        ]);
      }
    } catch {
      setStream((prev) => [
        ...prev,
        { sender: "ai", text: "Mất kết nối máy chủ. Thử lại sau." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#121214]/90 border border-white/[0.06] rounded-2xl flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:scale-105 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)] transition-all backdrop-blur-xl"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            className="absolute bottom-[4.5rem] right-0 w-[22rem] max-w-[calc(100vw-2rem)] h-[32rem] bg-[#121214]/90 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col shadow-2xl"
          >
            <div className="bg-[#0D0D0C]/80 px-4 py-3 border-b border-white/[0.06] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-white font-semibold tracking-wide text-[11px]">
                  AI Wealth Companion
                </span>
              </div>
              <span className="text-[9px] text-emerald-400/90 font-mono">LIVE</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {stream.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[92%] ${
                      m.sender === "user"
                        ? "bg-white/[0.08] text-white px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed"
                        : "space-y-2"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <p>{m.text}</p>
                    ) : (
                      <>
                        <p className="text-zinc-300 text-[11px] leading-relaxed px-1">{m.text}</p>
                        {m.blocks && (
                          <div className="space-y-2">
                            <InsightCard
                              icon={<Target className="w-3 h-3 text-sky-400" />}
                              label="Luận điểm"
                              accent="border-sky-500/20 bg-sky-500/[0.04]"
                              body={m.blocks.thesis}
                            />
                            <InsightCard
                              icon={<TrendingUp className="w-3 h-3 text-emerald-400" />}
                              label="Catalysts"
                              accent="border-emerald-500/20 bg-emerald-500/[0.04]"
                              body={m.blocks.catalysts}
                            />
                            <InsightCard
                              icon={<ShieldAlert className="w-3 h-3 text-rose-400" />}
                              label="Risks"
                              accent="border-rose-500/20 bg-rose-500/[0.04]"
                              body={m.blocks.risks}
                            />
                            <div className="bg-[#0D0D0C]/60 border border-white/[0.06] rounded-2xl p-3">
                              <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
                                <span>Độ tin cậy</span>
                                <span className="text-emerald-400 font-bold font-mono">
                                  {m.blocks.confidence}%
                                </span>
                              </div>
                              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.blocks.confidence}%` }}
                                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                  Đang phân tích...
                </div>
              )}
            </div>

            <div className="p-3 bg-[#0D0D0C]/80 border-t border-white/[0.06] flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && dispatchQuery()}
                placeholder="Hỏi mã cổ phiếu hoặc thị trường..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500/40 placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={dispatchQuery}
                disabled={isLoading || !query.trim()}
                className="p-2.5 bg-sky-600/90 hover:bg-sky-500 disabled:opacity-40 text-white rounded-2xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  accent,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  body: string;
}) {
  return (
    <div className={`border rounded-2xl p-3 ${accent}`}>
      <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-medium uppercase tracking-wide">
        {icon}
        {label}
      </span>
      <p className="text-zinc-300 text-[11px] mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}
