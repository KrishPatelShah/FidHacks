import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParsedReceipt, Plant, PlantCategory } from "@/types/domain";

// Base URL of the FastAPI backend. Configure with EXPO_PUBLIC_API_URL in .env.
// Defaults to the local Docker backend (works from the iOS simulator).
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

const TOKEN_KEY = "financial_garden_token_v1";
const DEFAULT_TIMEOUT_MS = 8000;

let cachedToken: string | null = null;

async function request<T>(path: string, options: RequestInit = {}, auth = false, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string>) };
    if (auth) {
      const token = await ensureToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, { ...options, headers, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/** Log in as the demo user and cache the bearer token. */
export async function ensureToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  try {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) {
      cachedToken = stored;
      return stored;
    }
  } catch {
    // ignore
  }
  try {
    const data = await request<{ access_token: string }>("/auth/demo", { method: "POST" });
    cachedToken = data.access_token;
    await AsyncStorage.setItem(TOKEN_KEY, data.access_token).catch(() => {});
    return cachedToken;
  } catch {
    return null;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    await request("/health", { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

type BackendPlant = {
  id: string;
  type: string;
  flower_name: string;
  stage: number;
  growth: number;
  quantity: number;
  water: number;
  sunlight: number;
  fertilizer: number;
  unlocked: boolean;
};

function mapPlant(p: BackendPlant): Plant {
  const now = new Date().toISOString();
  return {
    id: p.id,
    userId: "demo_user",
    type: p.type as PlantCategory,
    flowerName: p.flower_name,
    stage: p.stage,
    growth: p.growth,
    quantity: p.quantity,
    water: p.water,
    sunlight: p.sunlight,
    fertilizer: p.fertilizer,
    unlocked: p.unlocked,
    createdAt: now,
    updatedAt: now
  };
}

/** Fetch the demo user's plants from Postgres via FastAPI. Returns null on failure. */
export async function fetchPlants(): Promise<Plant[] | null> {
  try {
    const data = await request<BackendPlant[]>("/plants", { method: "GET" }, true);
    return data.map(mapPlant);
  } catch {
    return null;
  }
}

/** Persist a growth event to the backend (best-effort; ignores failure). */
export async function growPlantRemote(
  plantId: string,
  reward: { sunlight?: number; water?: number; fertilizer?: number }
): Promise<void> {
  try {
    await request(
      `/plants/${plantId}/grow`,
      {
        method: "POST",
        body: JSON.stringify({
          sunlight: reward.sunlight ?? 0,
          water: reward.water ?? 0,
          fertilizer: reward.fertilizer ?? 0
        })
      },
      true
    );
  } catch {
    // best-effort only
  }
}

export type QuestionnairePayload = {
  budgeting_confidence: number;
  savings_confidence: number;
  credit_debt_confidence: number;
  retirement_confidence: number;
  career_taxes_confidence: number;
  investing_confidence: number;
  primary_goal: string;
};

/** Persist questionnaire results to the backend (best-effort). */
export async function submitQuestionnaireRemote(payload: QuestionnairePayload): Promise<void> {
  try {
    await request("/questionnaire", { method: "POST", body: JSON.stringify(payload) }, true);
  } catch {
    // best-effort only
  }
}

/** Ask the Sunflower tutor via the backend. Returns null on failure so callers can fall back. */
export async function askSunflowerRemote(question: string): Promise<string | null> {
  try {
    const data = await request<{ answer: string }>("/sunflower/ask", {
      method: "POST",
      body: JSON.stringify({ question })
    });
    return data.answer ?? null;
  } catch {
    return null;
  }
}

export type RemoteScanResult = ParsedReceipt & { source: "gemini" | "fallback" };

/** Send a receipt image to the backend (which calls Gemini). Returns null on failure. */
export async function scanReceiptRemote(imageBase64: string, mimeType = "image/jpeg"): Promise<RemoteScanResult | null> {
  try {
    const data = await request<RemoteScanResult & { image?: never }>(
      "/receipts/scan",
      { method: "POST", body: JSON.stringify({ image_base64: imageBase64, mime_type: mimeType }) },
      false,
      20000
    );
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}
