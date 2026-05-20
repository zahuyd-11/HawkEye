import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/generative-ai';
import { generateCfaReportTemplate } from '@/lib/ai/pdf-template';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ticker, companyName, currentPrice, quantResult } = await request.json();
    const { regimeDetected, portfolio } = quantResult;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: "application/json" }
    });

    // 1. Thu thập luận điểm từ Đặc vụ Bull & Bear như cấu trúc cũ
    const bullPrompt = `You are the Lead Bull Analyst (CFA). Analyze growth catalysts for ${ticker} (${companyName}).`;
    const bullResponse = await model.generateContent(bullPrompt);
    const bullThesis = bullResponse.response.text();

    const bearPrompt = `You are the Forensic Auditor & Bear Analyst. Find structural risks and window dressing signs for ${ticker} given long thesis: ${bullThesis}.`;
    const bearResponse = await model.generateContent(bearPrompt);
    const bearThesis = bearResponse.response.text();

    // 2. Đặc vụ Phán quyết cuối cùng (CRO) - Thực hiện đồng hóa Mô hình toán DCF/FCFF
    const croPrompt = `
      You are the Chief Risk Officer and Final Arbiter at HawkEye Investment Committee.
      Evaluate the debate for ${ticker} (${companyName}).
      [BULL]: ${bullThesis}
      [BEAR]: ${bearThesis}

      You must run a professional Discounted Cash Flow (DCF) to the Firm (FCFF) model according to CFA Equity Valuation standards.
      Formula to simulate: FCFF = EBIT * (1 - Tax Rate) + D&A - Capital Expenditures - Change in Working Capital.
      Project for the next 5 years based on current regime: ${regimeDetected}.

      You MUST respond ONLY with a valid JSON object matching the following structure exactly, no extra text wrappers:
      {
        "recommendation": "BUY" | "HOLD" | "SELL",
        "targetPrice": number,
        "convictionScore": number,
        "executiveSummary": "Vietnamese string summarizing the committee conclusion.",
        "dupontAnalysis": {
          "roe": "string", "netMargin": "string", "assetTurnover": "string", "leverageRatio": "string"
        },
        "dcfForecast": {
          "wacc": number,
          "terminalGrowth": number,
          "terminalValue": number,
          "enterpriseValue": number,
          "forecastYears": [
            {
              "year": "2026F",
              "revenue": number,
              "ebit": number,
              "tax": number,
              "capex": number,
              "workingCapitalChange": number,
              "fcff": number,
              "pvFcff": number
            },
            { "year": "2027F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
            { "year": "2028F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
            { "year": "2029F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number },
            { "year": "2030F", "revenue": number, "ebit": number, "tax": number, "capex": number, "workingCapitalChange": number, "fcff": number, "pvFcff": number }
          ]
        },
        "actionChecklist": ["string", "string"]
      }
    `;

    const finalCommitteeResponse = await model.generateContent(croPrompt);
    const rawText = finalCommitteeResponse.response.text();
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const cleanJsonData = JSON.parse(cleanText);

    // 3. Đổ toàn bộ dữ liệu lập luận và bảng số liệu toán DCF vào template HTML
    const htmlReportContent = generateCfaReportTemplate({
      ticker,
      companyName,
      currentPrice,
      targetPrice: cleanJsonData.targetPrice,
      convictionScore: cleanJsonData.convictionScore,
      regime: regimeDetected,
      recommendation: cleanJsonData.recommendation,
      executiveSummary: cleanJsonData.executiveSummary,
      dupontAnalysis: cleanJsonData.dupontAnalysis,
      dcfForecast: cleanJsonData.dcfForecast, // Gói dữ liệu mới được nhúng vào template
      actionChecklist: cleanJsonData.actionChecklist
    });

    return NextResponse.json({
      success: true,
      ticker,
      recommendation: cleanJsonData.recommendation,
      convictionScore: cleanJsonData.convictionScore,
      htmlReport: htmlReportContent
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
