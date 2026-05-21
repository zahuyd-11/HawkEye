import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    // 1. Chuyển đổi hạ tầng: Sử dụng NextAuth để đọc Session thay vì Supabase
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized access blocked' }, { status: 401 });
    }

    const supabase = await createClient();

    // 2. Fetch personalized settings from profiles table with graceful fallback to prevent DB failures
    let profile = { risk_appetite: 'balanced', capital_range: '500M VND+', investment_goal: 'growth' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('risk_appetite, capital_range, investment_goal')
        .eq('id', session.user.id)
        .single();
      
      if (data && !error) {
        profile = data;
      }
    } catch (e) {
      console.log("Supabase profiles table fetch failed, using fallback settings:", e);
    }

    const { ticker, marketData, quantAllocation } = await request.json();

    // 3. Initialize Real AI Engine (Gemini)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key missing in environment' }, { status: 500 });
    }
    
    // Sửa lỗi import SDK chính xác
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // 4. Prompt shaped following CFA Research Challenge guidelines (Wall Street Style)
    const systemPrompt = `
      You are a Senior Investment Strategist and CFA Charterholder at HawkEye Operating System.
      Analyze the stock/ETF ticker: ${ticker} specifically tailored to this retail client profile:
      - Risk Appetite: ${profile.risk_appetite || 'balanced'}
      - Capital Range: ${profile.capital_range || '500M VND+'}
      - Investment Strategy: ${profile.investment_goal || 'growth'}

      Current Market Regime Allocations Computed by Quant Engine:
      ${JSON.stringify(quantAllocation, null, 2)}

      Raw Financial Metrics Provided:
      ${JSON.stringify(marketData, null, 2)}

      Execute a professional Investment Thesis following CFA Research Challenge guidelines.
      Structure the response in perfect Markdown with 3 parts:
      1. Investment Summary & Conviction Score (0-100)
      2. Key Growth Catalysts vs Forensic Risks (FSA Standards)
      3. Tailored If-Then Action Plan for this specific user's capital.
    `;

    const result = await model.generateContent(systemPrompt);
    const aiResponseText = result.response.text();

    return NextResponse.json({ success: true, analysis: aiResponseText });

  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

