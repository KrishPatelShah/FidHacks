import { scanReceiptRemote } from "@/services/api";
import { fallbackReceipt } from "@/data/receiptFallback";
import { ParsedReceipt, SpendCategory } from "@/types/domain";

export type ScanResult = ParsedReceipt & { source: "gemini" | "fallback" };

const ALLOWED: SpendCategory[] = ["needs", "wants", "save", "income"];

function coerce(raw: unknown): ParsedReceipt | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const items = itemsRaw
    .map((item) => {
      const it = item as Record<string, unknown>;
      const category = String(it.category ?? "").toLowerCase() as SpendCategory;
      return {
        name: String(it.name ?? "Item"),
        price: Number(it.price ?? 0) || 0,
        category: ALLOWED.includes(category) ? category : "wants"
      };
    })
    .filter((item) => item.price > 0);

  if (items.length === 0) return null;

  return {
    merchant: String(data.merchant ?? "Unknown Merchant"),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    total: Number(data.total ?? 0) || items.reduce((sum, i) => sum + i.price, 0),
    items
  };
}

/**
 * Send a receipt image to the FastAPI backend (which calls Gemini server-side)
 * and return parsed transaction data. Always resolves: if the backend is
 * unreachable or returns nothing usable, it falls back to the mock receipt so
 * the live demo keeps working.
 */
export async function scanReceipt(imageBase64: string, mimeType = "image/jpeg"): Promise<ScanResult> {
  const remote = await scanReceiptRemote(imageBase64, mimeType);
  if (remote) {
    const parsed = coerce(remote);
    if (parsed) {
      return { ...parsed, source: remote.source === "gemini" ? "gemini" : "fallback" };
    }
  }
  return { ...fallbackReceipt, source: "fallback" };
}
