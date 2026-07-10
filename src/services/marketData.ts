import { TimeRange } from "@/data/investments";

// Live market data via Twelve Data (https://twelvedata.com/docs).
// Free tier: 800 requests/day, 8 credits/min — plenty for a handful of symbols.
// The API key is a *public* client key, so it lives in EXPO_PUBLIC_ like the
// rest of this app's client config. Every function here is best-effort: it never
// throws, returning null / {} so the Stocks screen can fall back to its static
// mock values and keep the demo working offline or when the key is missing.
const KEY = process.env.EXPO_PUBLIC_TWELVE_DATA_KEY ?? "";
const BASE = "https://api.twelvedata.com";
const TIMEOUT_MS = 8000;

export function marketDataConfigured(): boolean {
  return KEY.length > 0;
}

export type LiveQuote = { price: number; changePct: number };

// Interval + point count for each range chip. 1D/1W use intraday bars for a
// detailed line; 1M/3M use daily bars. outputsize keeps each series short so the
// sparkline stays readable and the response stays small.
type RangeConfig = { interval: string; outputsize: number };
const RANGE_CONFIG: Record<TimeRange, RangeConfig> = {
  "1D": { interval: "5min", outputsize: 78 },
  "1W": { interval: "1h", outputsize: 35 },
  "1M": { interval: "1day", outputsize: 22 },
  "3M": { interval: "1day", outputsize: 66 }
};

async function getJson(path: string): Promise<any | null> {
  // TEMP DEBUG — remove once live data is confirmed working.
  console.log("[marketData] keyLoaded:", KEY ? `yes (…${KEY.slice(-4)})` : "NO", "path:", path);
  if (!KEY) {
    console.log("[marketData] No API key at runtime — set EXPO_PUBLIC_TWELVE_DATA_KEY and restart with `expo start -c`.");
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE}${path}${path.includes("?") ? "&" : "?"}apikey=${KEY}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    console.log("[marketData] HTTP", response.status, "for", path);
    if (!response.ok) return null;
    const body = await response.json();
    // Twelve Data signals errors (bad symbol, rate limit) with a top-level
    // { status: "error", code, message } object rather than an HTTP error.
    if (body && body.status === "error") {
      console.log("[marketData] API error:", body.code, body.message);
      return null;
    }
    console.log("[marketData] OK", path, "→", JSON.stringify(body).slice(0, 160));
    return body;
  } catch (error) {
    // Network failure, timeout/abort, or malformed JSON — fall back to mock.
    console.log("[marketData] fetch threw:", String(error));
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function toNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

// When one symbol is requested Twelve Data returns the payload directly; when
// several are batched it returns an object keyed by symbol. Normalize both to a
// { SYMBOL: payload } map so callers have one shape to read.
function normalizeBatch(body: any, symbols: string[]): Record<string, any> {
  if (!body) return {};
  if (symbols.length === 1) return { [symbols[0]]: body };
  return body;
}

// Fetch the latest price + daily % change for one or more symbols in a single
// request. Returns a map keyed by symbol; missing/failed symbols are omitted.
export async function fetchQuotes(symbols: string[]): Promise<Record<string, LiveQuote>> {
  if (symbols.length === 0) return {};
  const body = await getJson(`/quote?symbol=${symbols.join(",")}`);
  const batch = normalizeBatch(body, symbols);
  const result: Record<string, LiveQuote> = {};
  for (const symbol of symbols) {
    const entry = batch[symbol];
    if (!entry || entry.status === "error") continue;
    const price = toNumber(entry.close);
    const changePct = toNumber(entry.percent_change);
    if (price === null) continue;
    result[symbol] = { price, changePct: changePct ?? 0 };
  }
  return result;
}

// Fetch a historical close-price series for each symbol at the given range.
// Twelve Data returns values newest-first, so we reverse them into chronological
// order for the sparkline. Returns a map keyed by symbol; failures are omitted.
export async function fetchSeries(symbols: string[], range: TimeRange): Promise<Record<string, number[]>> {
  if (symbols.length === 0) return {};
  const { interval, outputsize } = RANGE_CONFIG[range];
  const body = await getJson(`/time_series?symbol=${symbols.join(",")}&interval=${interval}&outputsize=${outputsize}`);
  const batch = normalizeBatch(body, symbols);
  const result: Record<string, number[]> = {};
  for (const symbol of symbols) {
    const entry = batch[symbol];
    if (!entry || entry.status === "error" || !Array.isArray(entry.values)) continue;
    const closes = entry.values
      .map((bar: any) => toNumber(bar.close))
      .filter((n: number | null): n is number => n !== null)
      .reverse();
    if (closes.length >= 2) result[symbol] = closes;
  }
  return result;
}
