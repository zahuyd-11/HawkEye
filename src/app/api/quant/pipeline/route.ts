import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireApiSession } from "@/lib/api-auth";
import { RETAIL_LEGAL_DISCLAIMER } from "@/lib/compliance/disclaimer";
import { getOpenClawContextBundle, HAWKEYE_ENGINE_LABEL } from "@/lib/openclaw/engine";
import {
  buildProfileFromBody,
  buildFallbackGenome,
  parseGenomeFromAi,
  type BehavioralDnaProfile,
} from "@/lib/quant/trade-plan-v6";

export const dynamic = "force-dynamic";

function buildHawkEyePrompt(profile: BehavioralDnaProfile, openClawContext: string): string {
  const bondsExcluded = !profile.assetPreferences.includes("bonds");
  const technical =
    profile.timeline === "short" || profile.goal === "fast_rotation";

  return `
You are ${HAWKEYE_ENGINE_LABEL} (HawkEye AI Core). Output ONLY valid JSON. Use ONLY figures from OPENCLAW block. Never mention third-party AI brands.

USER PROFILE:
- Capital: ${profile.totalCapital} ${profile.currency} (≈ ${profile.capitalVnd} VND)
- Assets selected: ${profile.assetPreferences.join(", ")}
- Timeline: ${profile.timeline}
- Goal: ${profile.goal}
- Max drawdown: ${profile.maxDrawdown}%
- Behavioral bias: ${profile.behavioralBias}
- Check frequency: ${profile.marketCheckFrequency}
- Personal context: """${profile.userOpenNotes || "none"}"""

${openClawContext}

RULES:
1. Bonds excluded=${bondsExcluded} → bond weight 0, redistribute + dynamic cash buffer.
2. All amounts in ${profile.currency} with integer precision.
3. ${technical ? 'methodology="TECHNICAL_SWING" with technicalLevels (entry, SL, TP, MA, RSI).' : 'methodology="MPT".'}

JSON:
{
  "profileTitle": "string Vietnamese",
  "profileDesc": "string",
  "methodology": "MPT" | "TECHNICAL_SWING",
  "regimeDetected": "string",
  "cashBufferPct": number,
  "allocation": [{ "name": "string", "pct": number, "color": "#hex" }],
  "holdings": [{ "ticker": "string", "weightPct": number, "capitalAmount": number }],
  "technicalLevels": { "primaryTicker": "HPG", "entryPrice": number, "stopLoss": number, "takeProfit": number, "ma20": number, "ma50": number, "rsi14": number, "macdSignal": "string" },
  "behavioralInsights": ["string"],
  "activeAIModes": ["HawkEye AI Core", "..."]
}
`.trim();
}

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireApiSession();
    if (authError) return authError;

    const body = await request.json();
    const profile = buildProfileFromBody(body);
    if (!profile) {
      return NextResponse.json({ error: "Invalid or incomplete profile" }, { status: 400 });
    }

    const openClawContext = getOpenClawContextBundle(["HPG", "DGW", "FPT"]);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const data = buildFallbackGenome(profile);
      return NextResponse.json({
        success: true,
        mode: "hawkeye-local",
        data,
        disclaimer: RETAIL_LEGAL_DISCLAIMER,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(buildHawkEyePrompt(profile, openClawContext));
      const data =
        parseGenomeFromAi(result.response.text(), profile) ?? buildFallbackGenome(profile);

      return NextResponse.json({
        success: true,
        mode: "hawkeye-ai-core",
        data,
        disclaimer: RETAIL_LEGAL_DISCLAIMER,
      });
    } catch (aiError) {
      console.error("HawkEye AI Core error:", aiError);
      const data = buildFallbackGenome(profile);
      return NextResponse.json({
        success: true,
        mode: "hawkeye-fallback",
        data,
        disclaimer: RETAIL_LEGAL_DISCLAIMER,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pipeline failed";
    console.error("Quant pipeline error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
