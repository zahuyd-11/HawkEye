'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sliders, TrendingUp, BarChart3, ShieldAlert, Cpu } from 'lucide-react';

// Khai báo kiểu dữ liệu cho Ma trận Độ nhạy
interface MatrixCell {
  wacc: number;
  g: number;
  value: number;
}

export default function ValuationWorkspace({ ticker = "FPT" }: { ticker?: string }) {
  // 1. Quản lý trạng thái các biến số giả định Định giá (CFA Equity Valuation Inputs)
  const [baseFcff, setBaseFcff] = useState<number>(1500); // Tỷ VND
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0.15); // 15% CAGR
  const [wacc, setWacc] = useState<number>(0.115); // 11.5% Chi phí vốn
  const [terminalGrowth, setTerminalGrowth] = useState<number>(0.03); // 3% Tăng trưởng vĩnh viễn
  const [projectionYears] = useState<number>(5); // Giai đoạn dự phóng cố định 5 năm

  // 2. Động cơ tính toán tài chính Real-time (Client-side Quant Engine)
  const { intrinsicValue, sensitivityMatrix } = useMemo(() => {
    let totalPv = 0;
    let currentFcff = baseFcff;
    const cashFlows: number[] = [];

    // Tính toán Giá trị hiện tại (PV) của dòng tiền giai đoạn 1 (Dự phóng 5 năm)
    for (let i = 1; i <= projectionYears; i++) {
      currentFcff = currentFcff * (1 + revenueGrowth);
      const pv = currentFcff / Math.pow(1 + wacc, i);
      cashFlows.push(pv);
      totalPv += pv;
    }

    // Tính toán Giá trị thanh lý vĩnh viễn (Terminal Value) theo Gordon Growth Model
    const terminalValue = (currentFcff * (1 + terminalGrowth)) / (wacc - terminalGrowth);
    const pvTerminalValue = terminalValue / Math.pow(1 + wacc, projectionYears);
    const baseIntrinsicValue = totalPv + pvTerminalValue;

    // Khởi tạo Ma trận Độ nhạy 5x3 chéo biên độ dịch chuyển biến số
    const matrix: MatrixCell[] = [];
    const waccVariations = [wacc - 0.01, wacc - 0.005, wacc, wacc + 0.005, wacc + 0.01];
    const gVariations = [terminalGrowth - 0.005, terminalGrowth, terminalGrowth + 0.005];

    for (const w of waccVariations) {
      for (const g of gVariations) {
        let mTotalPv = 0;
        let mCurrentFcff = baseFcff;
        for (let i = 1; i <= projectionYears; i++) {
          mCurrentFcff = mCurrentFcff * (1 + revenueGrowth);
          mTotalPv += mCurrentFcff / Math.pow(1 + w, i);
        }
        const mTv = (mCurrentFcff * (1 + g)) / (w - g);
        const mPvTv = mTv / Math.pow(1 + w, projectionYears);
        matrix.push({ wacc: w, g: g, value: mTotalPv + mPvTv });
      }
    }

    return { intrinsicValue: baseIntrinsicValue, sensitivityMatrix: matrix };
  }, [baseFcff, revenueGrowth, wacc, terminalGrowth, projectionYears]);

  // Cấu hình hoạt họa cho hiệu ứng cuộn mượt và dịch chuyển lớp (Framer Motion Fluid UX)
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-6 font-sans relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Lớp lưới Cyber Grid trang trí nền */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-5 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-medium">LIVE QUANT DESK</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-mono">CFA MODEL V5</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">Mô Hình Định Giá Độ Nhạy Mô Phỏng {ticker}</h1>
        </div>
        <div className="text-right mt-4 md:mt-0 font-mono text-xs text-zinc-500">
          Hệ thống đồng bộ dữ liệu: <span className="text-emerald-400">Đang trực tuyến (60 FPS)</span>
        </div>
      </div>

      {/* WORKSPACE MATRIX GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* KHỐI TRÁI: ĐIỀU KHIỂN SLIDERS GIẢ ĐỊNH (CONTROL PANEL) */}
        <motion.div className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 rounded-xl space-y-6" variants={itemVariants}>
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Tham Số Giả Định Đầu Vào</h2>
          </div>

          {/* Slider 1: Dòng tiền cơ sở FCFF */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-zinc-400">Dòng tiền cơ sở (Base FCFF)</span>
              <span className="text-white font-medium">{baseFcff.toLocaleString()} Tỷ VND</span>
            </div>
            <input 
              type="range" min="100" max="5000" step="50" value={baseFcff}
              onChange={(e) => setBaseFcff(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Tốc độ tăng trưởng doanh thu CAGR */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-zinc-400">Tăng trưởng doanh thu (CAGR 5Y)</span>
              <span className="text-white font-medium">{(revenueGrowth * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="0.01" max="0.40" step="0.005" value={revenueGrowth}
              onChange={(e) => setRevenueGrowth(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Chi phí sử dụng vốn bình quan WACC */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-zinc-400">Chi phí vốn bình quan (WACC)</span>
              <span className="text-rose-400 font-medium">{(wacc * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="0.06" max="0.20" step="0.002" value={wacc}
              onChange={(e) => setWacc(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Tốc độ tăng trưởng vĩnh viễn g */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-zinc-400">Tăng trưởng vĩnh viễn (g)</span>
              <span className="text-sky-400 font-medium">{(terminalGrowth * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="0.01" max="0.05" step="0.001" value={terminalGrowth}
              onChange={(e) => setTerminalGrowth(Number(e.target.value))}
              className="w-full accent-sky-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* CẢNH BÁO RỦI RO ĐỘNG (STRESS FALLBACK) */}
          {wacc <= terminalGrowth && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex gap-2.5 items-start text-xs text-rose-400"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div><strong>Lỗi mô hình toán:</strong> Chi phí vốn (WACC) phải lớn hơn Tốc độ tăng trưởng vĩnh viễn (g) để mô hình Gordon không bị tràn vô cực.</div>
            </motion.div>
          )}
        </motion.div>

        {/* KHỐI PHẢI: HIỂN THỊ KẾT QUẢ ĐỘNG & BIỂU ĐỒ ĐỘ NHẠY (OUTPUT DESK) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THẺ GIÁ TRỊ NỘI TẠI TOÀN MÀN HÌNH (INTRINSIC VALUE CARD) */}
          <motion.div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-xl relative overflow-hidden" variants={itemVariants}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-32 h-32 text-white" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Giá Trị Nội Tại Định Giá Cơ Sở
            </div>
            
            {/* Hoạt họa Thay đổi số mượt mà khi kéo Sliders */}
            <div className="flex items-baseline gap-2">
              <motion.span 
                key={intrinsicValue}
                initial={{ opacity: 0.6, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight text-white font-mono"
              >
                {wacc <= terminalGrowth ? "NaN" : Math.round(intrinsicValue).toLocaleString()}
              </motion.span>
              <span className="text-zinc-500 text-sm font-medium">Tỷ VND</span>
            </div>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
              * Đây là kết quả tính toán chiết khấu dòng tiền tự do doanh nghiệp (FCFF Model). Giá trị nội tại tự động đồng bộ hóa tương quan khi cấu trúc phân bổ rủi ro hoặc dòng tiền dịch chuyển.
            </p>
          </motion.div>

          {/* MA TRẬN ĐỘ NHẠY ĐA CHIỀU (SENSITIVITY MATRIX HEATMAP) */}
          <motion.div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 rounded-xl" variants={itemVariants}>
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Ma Trận Độ Nhạy Định Giá (WACC vs Growth Rate)</h2>
            </div>

            {/* BẢNG HEATMAP TỰ ĐỘNG TÍNH TOÁN THEO REGIME */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="p-2 text-left text-zinc-500 font-normal">WACC \ g</th>
                    {Array.from(new Set(sensitivityMatrix.map(c => c.g))).map((g, idx) => (
                      <th key={idx} className="p-2 text-center text-sky-400 font-medium">g = {(g * 100).toFixed(1)}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(sensitivityMatrix.map(c => c.wacc))).map((w, wIdx) => (
                    <tr key={wIdx} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="p-2 text-left text-rose-400 font-medium">WACC = {(w * 100).toFixed(1)}%</td>
                      {sensitivityMatrix.filter(c => c.wacc === w).map((cell, cIdx) => {
                        // Xác định xem ô này có phải là giá trị cơ sở hiện tại được chọn không
                        const isBaseCell = Math.abs(cell.wacc - wacc) < 0.001 && Math.abs(cell.g - terminalGrowth) < 0.001;
                        
                        return (
                          <td 
                            key={cIdx} 
                            className={`p-3 text-center transition-all duration-300 rounded ${
                              isBaseCell 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold scale-[1.02]' 
                                : cell.value > intrinsicValue 
                                  ? 'text-zinc-300 opacity-90' 
                                  : 'text-zinc-500 opacity-75'
                            }`}
                          >
                            {wacc <= terminalGrowth || cell.wacc <= cell.g ? "NaN" : Math.round(cell.value).toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800/60 font-mono text-[10px] text-zinc-500 justify-end">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-emerald-500/20 border border-emerald-500/40" />
                <span>Kịch bản cơ sở (Đang chọn)</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
