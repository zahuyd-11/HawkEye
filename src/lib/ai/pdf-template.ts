// Thêm interface định nghĩa cấu trúc dữ liệu DCF mới nhận về từ AI
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

interface CfaReportData {
  ticker: string;
  companyName: string;
  targetPrice: number;
  currentPrice: number;
  convictionScore: number;
  regime: string;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  executiveSummary: string;
  dupontAnalysis: { roe: string; netMargin: string; assetTurnover: string; leverageRatio: string; };
  dcfForecast: {
    wacc: number;
    terminalGrowth: number;
    terminalValue: number;
    enterpriseValue: number;
    forecastYears: DcfYearRow[];
  };
  actionChecklist: string[];
}

export function generateCfaReportTemplate(data: CfaReportData): string {
  const upside = (((data.targetPrice - data.currentPrice) / data.currentPrice) * 100).toFixed(1);
  
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #ffffff; color: #0f172a; margin: 0; padding: 40px; }
        .header-table { width: 100%; border-bottom: 2px solid #047857; padding-bottom: 15px; margin-bottom: 25px; }
        .ticker-badge { font-size: 26px; font-weight: 800; color: #047857; }
        .recommendation { font-size: 20px; font-weight: 700; color: ${data.recommendation === 'BUY' ? '#059669' : data.recommendation === 'SELL' ? '#dc2626' : '#d97706'}; }
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
            <div style="font-size: 11px; color: #64748b; font-family: monospace;">HAWKEYE TERMINAL // INVESTMENT COMMITTEE REPORT</div>
          </td>
          <td style="text-align: right;">
            <div class="recommendation">KHUYẾN NGHỊ: ${data.recommendation}</div>
            <div style="font-size: 11.5px; color: #334155; font-weight: bold; margin-top: 4px;">Mục tiêu: ${data.targetPrice.toLocaleString()} VND (${upside}% Upside)</div>
          </td>
        </tr>
      </table>

      <h1>1. Tóm Tắt Luận Điểm Ban Giám Đốc (Executive Summary)</h1>
      <p><strong>Chỉ số Tin cậy Danh mục (Conviction Score): ${data.convictionScore}/100</strong> — Trạng thái vĩ mô hiện tại: <strong>${data.regime}</strong>. ${data.executiveSummary}</p>

      <h1>2. Phân Tích Chất Lượng Lợi Nhuận (CFA DuPont Matrix)</h1>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tỷ suất LN/Vốn CSH (ROE)</th>
            <th>Biên LN Thuần (Net Margin)</th>
            <th>Vòng quay Tài sản (Asset Turnover)</th>
            <th>Đòn bẩy Tài chính (Leverage)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 700; color: #047857;">${data.dupontAnalysis.roe}</td>
            <td>${data.dupontAnalysis.netMargin}</td>
            <td>${data.dupontAnalysis.assetTurnover}</td>
            <td>${data.dupontAnalysis.leverageRatio}</td>
          </tr>
        </tbody>
      </table>

      <h1>3. Mô Hình Mô Phỏng Dòng Tiền Doanh Nghiệp (5-Year DCF / FCFF Model)</h1>
      <p>Dự phóng các cấu phần dòng tiền tự do của doanh nghiệp (FCFF) chiết khấu về hiện tại dựa trên giả định Chi phí vốn bình quan <strong>WACC = ${(data.dcfForecast.wacc * 100).toFixed(1)}%</strong> và tăng trưởng vĩnh viễn <strong>g = ${(data.dcfForecast.terminalGrowth * 100).toFixed(1)}%</strong>:</p>
      
      <table class="data-table font-mono">
        <thead>
          <tr>
            <th>Chỉ tiêu tài chính (Tỷ VND)</th>
            ${data.dcfForecast.forecastYears.map(y => `<th>${y.year}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: left; font-weight: bold;">Doanh thu thuần</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>${Math.round(y.revenue).toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align: left;">Lợi nhuận trước lãi vay & thuế (EBIT)</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>${Math.round(y.ebit).toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align: left; color: #dc2626;">Thuế thu nhập DN ước tính</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>-${Math.round(y.tax).toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align: left; color: #dc2626;">Chi phí đầu tư tài sản cố định (Capex)</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>-${Math.round(y.capex).toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align: left;">Thay đổi vốn lưu động (ΔWC)</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>${Math.round(y.workingCapitalChange).toLocaleString()}</td>`).join('')}
          </tr>
          <tr style="background-color: #f8fafc; font-weight: bold;">
            <td style="text-align: left; color: #047857;">Dòng tiền tự do (FCFF)</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>${Math.round(y.fcff).toLocaleString()}</td>`).join('')}
          </tr>
          <tr class="highlight-row">
            <td style="text-align: left;">Giá trị hiện tại dòng tiền (PV of FCFF)</td>
            ${data.dcfForecast.forecastYears.map(y => `<td>${Math.round(y.pvFcff).toLocaleString()}</td>`).join('')}
          </tr>
        </tbody>
      </table>

      <div style="font-size: 11.5px; font-family: monospace; background-color: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 20px;">
        • Giá trị thanh lý cuối kỳ (Terminal Value): <strong>${Math.round(data.dcfForecast.terminalValue).toLocaleString()} Tỷ VND</strong> <br/>
        • Tổng giá trị doanh nghiệp tính toán (Enterprise Value): <strong>${Math.round(data.dcfForecast.enterpriseValue).toLocaleString()} Tỷ VND</strong>
      </div>

      <h1>4. Kịch Bản Hành Động Khớp Vốn Độc Bản (If-Then Strategy)</h1>
      <div style="margin-top: 5px;">
        ${data.actionChecklist.map(step => `<div style="font-size: 12.5px; margin-bottom: 6px; color: #334155;">✓ ${step}</div>`).join('')}
      </div>

      <div class="compliance-box" style="margin-top: 30px; font-size: 11px; border: 1px solid #cbd5e1; padding: 10px; border-radius: 4px; color: #475569; background-color: #f8fafc;">
        <strong>Tiêu chuẩn Đạo đức & Tuân thủ (CFA Ethics Compliance):</strong> Toàn bộ dữ liệu tính toán mô phỏng dựa trên các quy tắc khách quan, loại bỏ xung đột lợi ích của các nhà môi giới (Zero-Brokerage Bias Pool).
      </div>

      <div class="footer-note">
        Hệ thống tự động thiết lập bởi Core Engine HawkEye Operating System. Bản quyền mô hình thuộc về Đặng Gia Huy & Cộng sự.
      </div>

    </body>
    </html>
  `;
}
