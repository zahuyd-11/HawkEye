/**
 * VN30 live price ingest — Yahoo Finance (.VN) + VNDirect finfo fallback + seed.
 */
import { VN30_TICKERS } from "@/lib/constants";
import { getCompanySnapshot } from "@/data/market-snapshot";
import {
  readVn30Cache,
  writeVn30Cache,
  type Vn30LiveCache,
  type Vn30LiveQuote,
} from "@/lib/openclaw/vn30-store";

const YAHOO_UA =
  "Mozilla/5.0 (compatible; HawkEyeOpenClaw/1.0; +https://hawkeye.vn)";

export const VN30_UNIVERSE = [...new Set(VN30_TICKERS.map((t) => t.toUpperCase()))];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface YahooMeta {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  regularMarketVolume?: number;
  longName?: string;
  shortName?: string;
}

async function fetchYahooQuote(ticker: string): Promise<Vn30LiveQuote | null> {
  const symbol = `${ticker}.VN`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
  const res = await fetch(url, {
    headers: { "User-Agent": YAHOO_UA },
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    chart?: { result?: Array<{ meta?: YahooMeta }> };
  };
  const meta = json.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  if (typeof price !== "number" || !Number.isFinite(price)) return null;

  const prev = meta.chartPreviousClose ?? price;
  const changePct =
    prev > 0 ? parseFloat((((price - prev) / prev) * 100).toFixed(2)) : 0;

  return {
    ticker,
    price: Math.round(price),
    previousClose: Math.round(prev),
    changePct,
    volume: Math.round(meta.regularMarketVolume ?? 0),
    companyName: meta.longName ?? meta.shortName ?? ticker,
    source: "yahoo.vn",
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchVndirectQuote(ticker: string): Promise<Vn30LiveQuote | null> {
  const url = `https://finfo-api.vndirect.com.vn/v4/stock_prices/o/${ticker}.json?size=1&sort=date:desc`;
  const res = await fetch(url, {
    headers: { "User-Agent": YAHOO_UA },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: Array<{
      close?: number;
      priorClose?: number;
      nmVolume?: number;
      date?: string;
    }>;
  };
  const row = json.data?.[0];
  const price = row?.close;
  if (typeof price !== "number") return null;

  const prev = row.priorClose ?? price;
  const snap = getCompanySnapshot(ticker);

  return {
    ticker,
    price: Math.round(price * 1000),
    previousClose: Math.round((prev ?? price) * 1000),
    changePct:
      prev > 0 ? parseFloat((((price - prev) / prev) * 100).toFixed(2)) : 0,
    volume: Math.round(row.nmVolume ?? 0),
    companyName: snap.companyName,
    source: "vndirect.finfo",
    fetchedAt: new Date().toISOString(),
  };
}

function seedFallback(ticker: string): Vn30LiveQuote {
  const snap = getCompanySnapshot(ticker);
  return {
    ticker,
    price: snap.currentPrice,
    previousClose: snap.currentPrice,
    changePct: 0,
    volume: 0,
    companyName: snap.companyName,
    source: "seed.fallback",
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchOneTicker(ticker: string): Promise<Vn30LiveQuote> {
  try {
    const yahoo = await fetchYahooQuote(ticker);
    if (yahoo) return yahoo;
  } catch {
    /* try next provider */
  }

  await sleep(350);

  try {
    const vnd = await fetchVndirectQuote(ticker);
    if (vnd) return vnd;
  } catch {
    /* seed */
  }

  return seedFallback(ticker);
}

export interface Vn30IngestResult {
  cache: Vn30LiveCache;
  liveCount: number;
  fallbackCount: number;
  durationMs: number;
}

/** Ingest all VN30 tickers sequentially (rate-limit safe). */
export async function ingestVn30LivePrices(
  tickers: string[] = VN30_UNIVERSE
): Promise<Vn30IngestResult> {
  const started = Date.now();
  const cache = readVn30Cache();
  cache.ingestStatus = "running";
  cache.errors = [];
  writeVn30Cache(cache);

  let liveCount = 0;
  let fallbackCount = 0;

  for (const raw of tickers) {
    const ticker = raw.toUpperCase().trim();
    try {
      const quote = await fetchOneTicker(ticker);
      cache.quotes[ticker] = quote;
      if (quote.source === "seed.fallback") fallbackCount++;
      else liveCount++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      cache.errors.push(`${ticker}: ${msg}`);
      cache.quotes[ticker] = seedFallback(ticker);
      fallbackCount++;
    }
    await sleep(450);
  }

  cache.lastIngestAt = new Date().toISOString();
  cache.ingestStatus =
    liveCount === 0 ? "failed" : fallbackCount > 0 ? "partial" : "ok";
  writeVn30Cache(cache);

  return {
    cache,
    liveCount,
    fallbackCount,
    durationMs: Date.now() - started,
  };
}

export function applyLivePriceToSnapshot(ticker: string): number {
  const live = readVn30Cache().quotes[ticker.toUpperCase()];
  if (live && live.price > 0) return live.price;
  return getCompanySnapshot(ticker).currentPrice;
}
