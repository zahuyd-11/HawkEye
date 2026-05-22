import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { openClawEngine, type RawFinancialRow } from "@/lib/openclaw/engine";

export const dynamic = "force-dynamic";

/** POST { ticker, rows?, source? } — ingest & curate raw financial matrix */
export async function POST(request: Request) {
  try {
    const { error: authError } = await requireApiSession();
    if (authError) return authError;

    const body = await request.json();
    const ticker = String(body.ticker ?? "HPG").toUpperCase().trim();
    const rows = Array.isArray(body.rows) ? (body.rows as RawFinancialRow[]) : [];

    const profile =
      rows.length > 0
        ? openClawEngine.curateRawFinancials(rows, {
            ticker,
            companyName: body.companyName,
            source: body.source ?? "api.openclaw.curate",
          })
        : openClawEngine.getCuratedSnapshot(ticker);

    return NextResponse.json({
      success: true,
      engine: "HawkEye OpenClaw Curation Layer",
      profile,
      aiContext: openClawEngine.buildAiContextBlock(ticker),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OpenClaw curation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const ticker = new URL(request.url).searchParams.get("ticker")?.toUpperCase() ?? "DGW";
  const profile = openClawEngine.getCuratedSnapshot(ticker);
  return NextResponse.json({
    success: true,
    tickers: openClawEngine.listAvailableTickers(),
    profile,
    aiContext: openClawEngine.buildAiContextBlock(ticker),
  });
}
