import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export interface Vn30LiveQuote {
  ticker: string;
  price: number;
  previousClose: number;
  changePct: number;
  volume: number;
  companyName: string;
  source: "yahoo.vn" | "vndirect.finfo" | "seed.fallback";
  fetchedAt: string;
}

export interface Vn30LiveCache {
  version: 1;
  lastIngestAt: string | null;
  ingestStatus: "idle" | "running" | "ok" | "partial" | "failed";
  quotes: Record<string, Vn30LiveQuote>;
  errors: string[];
}

const DEFAULT_CACHE: Vn30LiveCache = {
  version: 1,
  lastIngestAt: null,
  ingestStatus: "idle",
  quotes: {},
  errors: [],
};

function cachePath(): string {
  return path.join(process.cwd(), "src", "data", "vn30-live-cache.json");
}

export function readVn30Cache(): Vn30LiveCache {
  const file = cachePath();
  if (!existsSync(file)) return { ...DEFAULT_CACHE };
  try {
    const raw = readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw) as Vn30LiveCache;
    return { ...DEFAULT_CACHE, ...parsed, quotes: parsed.quotes ?? {} };
  } catch {
    return { ...DEFAULT_CACHE };
  }
}

export function writeVn30Cache(cache: Vn30LiveCache): void {
  const file = cachePath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(cache, null, 2), "utf-8");
}

export function getLiveQuote(ticker: string): Vn30LiveQuote | null {
  const key = ticker.toUpperCase().trim();
  return readVn30Cache().quotes[key] ?? null;
}
