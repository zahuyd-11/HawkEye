import { NextResponse } from "next/server";
import { readVn30Cache } from "@/lib/openclaw/vn30-store";
import { ingestVn30LivePrices, VN30_UNIVERSE } from "@/lib/openclaw/vn30-crawler";
import { requireApiSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get("ticker")?.toUpperCase();
  const cache = readVn30Cache();

  if (ticker) {
    const quote = cache.quotes[ticker] ?? null;
    return NextResponse.json({
      success: true,
      ticker,
      quote,
      cacheMeta: {
        lastIngestAt: cache.lastIngestAt,
        ingestStatus: cache.ingestStatus,
      },
    });
  }

  return NextResponse.json({
    success: true,
    universe: VN30_UNIVERSE.length,
    lastIngestAt: cache.lastIngestAt,
    ingestStatus: cache.ingestStatus,
    quotes: cache.quotes,
    errors: cache.errors,
  });
}

/** Authenticated refresh — retail Pro can trigger on-demand */
export async function POST(request: Request) {
  const { error: authError } = await requireApiSession();
  if (authError) return authError;

  const body = await request.json().catch(() => ({}));
  const tickers = Array.isArray(body.tickers)
    ? (body.tickers as string[]).map((t) => String(t).toUpperCase())
    : undefined;

  const result = await ingestVn30LivePrices(tickers);
  return NextResponse.json({
    success: true,
    liveCount: result.liveCount,
    fallbackCount: result.fallbackCount,
    status: result.cache.ingestStatus,
    lastIngestAt: result.cache.lastIngestAt,
  });
}
