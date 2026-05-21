interface DcfYearRow {
  year: string;
  revenue: number;
  ebit: number;
  tax: number;
  capex: number;
  workingCapitalChange: number;
  fcff: number;
  pvFcff: number;
}

interface SegmentNote {
  segment: string;
  revenueSharePct: number;
  growthOutlook: string;
}

interface CfaReportData {
  ticker: string;
  companyName: string;
  targetPrice: number;
  currentPrice: number;
  convictionScore: number;
  regime: string;
  recommendation: "BUY" | "HOLD" | "SELL";
  executiveSummary: string;
  dupontAnalysis: {
    roe: string;
    netMargin: string;
    assetTurnover: string;
    leverageRatio: string;
  };
  dcfForecast: {
    wacc: number;
    terminalGrowth: number;
    terminalValue: number;
    enterpriseValue: number;
    forecastYears: DcfYearRow[];
  };
  segmentNotes?: SegmentNote[];
  actionChecklist: string[];
}

function fmtBillion(n: number | undefined | null): string {
  const v = typeof n === "number" && !Number.isNaN(n) ? Math.round(n) : 0;
  return v.toLocaleString("vi-VN");
}

function safeYears(dcf: CfaReportData["dcfForecast"]): DcfYearRow[] {
  const years = dcf?.forecastYears;
  if (Array.isArray(years) && years.length > 0) return years;
  return [
    { year: "2026F", revenue: 0, ebit: 0, tax: 0, capex: 0, workingCapitalChange: 0, fcff: 0, pvFcff: 0 },
    { year: "2027F", revenue: 0, ebit: 0, tax: 0, capex: 0, workingCapitalChange: 0, fcff: 0, pvFcff: 0 },
    { year: "2028F", revenue: 0, ebit: 0, tax: 0, capex: 0, workingCapitalChange: 0, fcff: 0, pvFcff: 0 },
    { year: "2029F", revenue: 0, ebit: 0, tax: 0, capex: 0, workingCapitalChange: 0, fcff: 0, pvFcff: 0 },
    { year: "2030F", revenue: 0, ebit: 0, tax: 0, capex: 0, workingCapitalChange: 0, fcff: 0, pvFcff: 0 },
  ];
}

export function generateCfaReportTemplate(data: CfaReportData): string {
  const upside = (
    ((data.targetPrice - data.currentPrice) / Math.max(data.currentPrice, 1)) *
    100
  ).toFixed(1);
  const years = safeYears(data.dcfForecast);
  const wacc = data.dcfForecast?.wacc ?? 0.112;
  const terminalGrowth = data.dcfForecast?.terminalGrowth ?? 0.03;
  const terminalValue = data.dcfForecast?.terminalValue ?? 0;
  const enterpriseValue = data.dcfForecast?.enterpriseValue ?? 0;
  const segments = data.segmentNotes ?? [];

  const segmentRows =
    segments.length > 0
      ? segments
          .map(
            (s) => `
          <tr>
            <td style="text-align:left;font-weight:600;">${s.segment}</td>
            <td>${s.revenueSharePct ?? "—"}%</td>
            <td style="text-align:left;">${s.growthOutlook || "—"}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="text-align:center;color:#94a3b8;">Segment breakdown từ DGC template</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #ffffff; color: #0f172a; margin: 0; padding: 40px; }
        .header-table { width: 100%; border-bottom: 2px solid #047857; padding-bottom: 15px; margin-bottom: 25px; }
        .ticker-badge { font-size: 26px; font-weight: 800; color: #047857; }
        .recommendation { font-size: 20px; font-weight: 700; color: ${data.recommendation === "BUY" ? "#059669" : data.recommendation === "SELL" ? "#dc2626" : "#d97706"}; }
        h1 { font-size: 16px; text-transform: uppercase; color: #1e293b; border-left: 4px solid #047857; padding-left: 10px; margin-top: 25px; margin-bottom: 12px; font-weight: 700; }
        p { font-size: 12.5px; line-height: 1.6; color: #334155; text-align: justify; margin: 0 0 12px 0; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
        table.data-table th { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; font-size: 11px; font-weight: 700; text-align: center; color: #1e293b; }
        table.data-table td { border: 1px solid #e2e8f0; padding: 8px; font-size: 11.5px; text-align: center; color: #475569; }
        .highlight-row { background-color: #f0fdf4; font-weight: 600; color: #166534; }
        .font-mono { font-family: monospace; }
        .footer-note { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>

      <table class="header-table">
        <tr>
          <td>
            <div class="ticker-badge">${data.ticker}: ${data.companyName}</div>
            <div style="font-size: 11px; color: #64748b; font-family: monospace;">HAWKEYE DEAL DIGEST // CFA COMMITTEE REPORT</div>
          </td>
          <td style="text-align: right;">
            <div class="recommendation">KHUYẾN NGHỊ: ${data.recommendation}</div>
            <div style="font-size: 11.5px; color: #334155; font-weight: bold; margin-top: 4px;">Mục tiêu: ${data.targetPrice.toLocaleString("vi-VN")} VND (${upside}% Upside)</div>
          </td>
        </tr>
      </table>

      <h1>1. Tóm Tắt Luận Điểm (Executive Summary)</h1>
      <p><strong>Conviction Score: ${data.convictionScore}/100</strong> — Regime: <strong>${data.regime}</strong>. ${data.executiveSummary || "—"}</p>

      <h1>2. Phân Khúc Doanh Thu (DGC / DGW Template)</h1>
      <table class="data-table">
        <thead>
          <tr>
            <th>Segment</th>
            <th>Tỷ trọng DT</th>
            <th>Triển vọng</th>
          </tr>
        </thead>
        <tbody>${segmentRows}</tbody>
      </table>

      <h1>3. DuPont Matrix</h1>
      <table class="data-table">
        <thead>
          <tr>
            <th>ROE</th>
            <th>Net Margin</th>
            <th>Asset Turnover</th>
            <th>Leverage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700;color:#047857;">${data.dupontAnalysis?.roe ?? "—"}</td>
            <td>${data.dupontAnalysis?.netMargin ?? "—"}</td>
            <td>${data.dupontAnalysis?.assetTurnover ?? "—"}</td>
            <td>${data.dupontAnalysis?.leverageRatio ?? "—"}</td>
          </tr>
        </tbody>
      </table>

      <h1>4. Mô Hình DCF 5 Năm (FCFF)</h1>
      <p>WACC = <strong>${(wacc * 100).toFixed(1)}%</strong> · Terminal g = <strong>${(terminalGrowth * 100).toFixed(1)}%</strong></p>

      <table class="data-table font-mono">
        <thead>
          <tr>
            <th>Chỉ tiêu (Tỷ VND)</th>
            ${years.map((y) => `<th>${y.year}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;font-weight:bold;">Doanh thu thuần</td>
            ${years.map((y) => `<td>${fmtBillion(y.revenue)}</td>`).join("")}
          </tr>
          <tr>
            <td style="text-align:left;">EBIT</td>
            ${years.map((y) => `<td>${fmtBillion(y.ebit)}</td>`).join("")}
          </tr>
          <tr>
            <td style="text-align:left;color:#dc2626;">Thuế DN</td>
            ${years.map((y) => `<td>-${fmtBillion(y.tax)}</td>`).join("")}
          </tr>
          <tr>
            <td style="text-align:left;color:#dc2626;">Capex</td>
            ${years.map((y) => `<td>-${fmtBillion(y.capex)}</td>`).join("")}
          </tr>
          <tr>
            <td style="text-align:left;">Δ Working Capital</td>
            ${years.map((y) => `<td>${fmtBillion(y.workingCapitalChange)}</td>`).join("")}
          </tr>
          <tr style="background-color:#f8fafc;font-weight:bold;">
            <td style="text-align:left;color:#047857;">FCFF</td>
            ${years.map((y) => `<td>${fmtBillion(y.fcff)}</td>`).join("")}
          </tr>
          <tr class="highlight-row">
            <td style="text-align:left;">PV of FCFF</td>
            ${years.map((y) => `<td>${fmtBillion(y.pvFcff)}</td>`).join("")}
          </tr>
        </tbody>
      </table>

      <div style="font-size:11.5px;font-family:monospace;background:#f8fafc;padding:10px;border:1px solid #e2e8f0;border-radius:4px;margin-bottom:20px;">
        • Terminal Value: <strong>${fmtBillion(terminalValue)} tỷ VND</strong><br/>
        • Enterprise Value: <strong>${fmtBillion(enterpriseValue)} tỷ VND</strong>
      </div>

      <h1>5. Kịch Bản Hành Động</h1>
      <div>
        ${(data.actionChecklist?.length ? data.actionChecklist : ["Xem lại phân bổ vốn", "Theo dõi drawdown", "Cập nhật Deal Digest hàng quý"])
          .map((step) => `<div style="font-size:12.5px;margin-bottom:6px;color:#334155;">✓ ${step}</div>`)
          .join("")}
      </div>

      <div class="footer-note">
        HawkEye Operating System · Bản quyền Đặng Gia Huy & Cộng sự · CFA Ethics Compliance
      </div>

    </body>
    </html>
  `;
}
