import { NextResponse } from "next/server";
import { ingestVn30LivePrices } from "@/lib/openclaw/vn30-crawler";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Vercel Cron / manual: refresh VN30 live quotes into OpenClaw cache */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestVn30LivePrices();
    return NextResponse.json({
      success: true,
      engine: "HawkEye OpenClaw VN30 Crawler",
      liveCount: result.liveCount,
      fallbackCount: result.fallbackCount,
      durationMs: result.durationMs,
      status: result.cache.ingestStatus,
      lastIngestAt: result.cache.lastIngestAt,
      errors: result.cache.errors.slice(0, 10),
      tickersUpdated: Object.keys(result.cache.quotes).length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "VN30 ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
