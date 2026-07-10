import AsyncStorage from "@react-native-async-storage/async-storage";
import { findLesson, learningModules } from "@/data/lessons";
import { localQuizForCategory } from "@/data/quizBank";
import { LearningModule, Lesson, ParsedReceipt, PlantCategory, UserProfile, Plant } from "@/types/domain";

const TOKEN_KEY = "financial_garden_access_token";
// Every request path in this client already starts with "/api", so strip a
// trailing slash and a trailing "/api" from the configured base URL to avoid a
// doubled "/api/api" prefix if the env var includes it.
const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "").replace(/\/api$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// The backend is considered "unavailable" (so we should fall back to local demo
// content) when the URL is unset, the network request itself fails, or the
// server returns a 5xx. HTTP 4xx responses mean the server is reachable and
// answered, so those are treated as real errors and re-thrown.
export function isBackendUnavailable(error: unknown): boolean {
  if (error instanceof ApiError) return error.status === undefined || error.status >= 500;
  return true;
}

type ApiPlant = Omit<Plant, "userId" | "flowerName" | "createdAt" | "updatedAt"> & {
  flower_name: string;
};

type ApiLesson = Omit<Lesson, "contentType" | "sourceUrl"> & {
  content_type: Lesson["contentType"];
  source_url?: string | null;
};

type ApiModule = Omit<LearningModule, "flowerName" | "lessons"> & {
  flower_name: string;
  lessons: ApiLesson[];
};

type ApiProfile = {
  id: string;
  display_name: string;
  streak_count: number;
  last_activity_date?: string | null;
  current_path: UserProfile["currentPath"];
  garden_visibility?: UserProfile["gardenVisibility"];
};

type ApiQuizQuestionResult = {
  id: string;
  correct: boolean;
  correct_index: number;
  explanation?: string | null;
};

type ApiQuizAttempt = {
  score: number;
  passed: boolean;
  earned?: { sunlight?: number; water?: number; fertilizer?: number };
  updated_plant?: ApiPlant | null;
  profile?: ApiProfile;
  lessons_completed?: number;
  quizzes_passed?: number;
  question_results?: ApiQuizQuestionResult[];
};

export type QuizQuestion = { id: string; prompt: string; options: string[]; explanation?: string };
export type QuizQuestionResult = {
  id: string;
  correct: boolean;
  correctIndex: number;
  explanation?: string;
};
export type QuizAttemptResult = {
  score: number;
  passed: boolean;
  earned: { sunlight?: number; water?: number; fertilizer?: number };
  plant?: Plant;
  profile?: UserProfile;
  lessonsCompleted?: number;
  quizzesPassed?: number;
  questionResults: QuizQuestionResult[];
  // Set when the attempt was graded locally (backend unreachable) so the garden
  // can apply a client-side growth reward instead of a server-driven one.
  local?: boolean;
  category?: PlantCategory;
};

export type Bootstrap = {
  profile: UserProfile;
  plants: Plant[];
  lessonsCompleted: number;
  quizzesPassed: number;
};

function assertConfigured() {
  if (!apiUrl) throw new ApiError("Missing EXPO_PUBLIC_API_URL. Set it to your FastAPI server URL.");
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  assertConfigured();
  const token = authenticated ? await getAccessToken() : null;
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });
  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) message = body.detail;
    } catch {}
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

function mapPlant(plant: ApiPlant): Plant {
  const now = new Date().toISOString();
  return {
    ...plant,
    id: String(plant.id),
    userId: "current-user",
    flowerName: plant.flower_name,
    createdAt: now,
    updatedAt: now
  };
}

function mapProfile(profile: ApiProfile): UserProfile {
  return {
    id: String(profile.id),
    displayName: profile.display_name,
    streakCount: profile.streak_count ?? 0,
    lastActivityDate: profile.last_activity_date ?? "",
    currentPath: profile.current_path ?? "beginner",
    gardenVisibility: profile.garden_visibility ?? "private"
  };
}

function mapLesson(lesson: ApiLesson): Lesson {
  return { ...lesson, id: String(lesson.id), contentType: lesson.content_type, sourceUrl: lesson.source_url ?? undefined };
}

function mapModule(module: ApiModule): LearningModule {
  return { ...module, id: String(module.id), flowerName: module.flower_name, lessons: module.lessons.map(mapLesson) };
}

export async function getAccessToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearAccessToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function demoLogin() {
  try {
    const response = await request<{ access_token: string }>("/api/auth/demo", { method: "POST" });
    await AsyncStorage.setItem(TOKEN_KEY, response.access_token);
    return response.access_token;
  } catch (error) {
    // Offline demo: let the user continue with the fully local garden. We do not
    // store a token, so authenticated calls simply fall back to local content.
    if (isBackendUnavailable(error)) return null;
    throw error;
  }
}

export async function getBootstrap(): Promise<Bootstrap> {
  const result = await request<{
    profile: ApiProfile;
    plants: ApiPlant[];
    lessons_completed?: number;
    quizzes_passed?: number;
  }>("/api/profile", {}, true);
  return {
    profile: mapProfile(result.profile),
    plants: result.plants.map(mapPlant),
    lessonsCompleted: result.lessons_completed ?? 0,
    quizzesPassed: result.quizzes_passed ?? 0
  };
}

export async function submitQuestionnaire(ratings: Record<string, number>, primaryGoal = "build_financial_confidence") {
  return request<{ recommended_path: UserProfile["currentPath"] }>(
    "/api/questionnaire",
    { method: "POST", body: JSON.stringify({
      budgeting_confidence: ratings.budgetingConfidence ?? 1,
      savings_confidence: ratings.savingsConfidence ?? 1,
      credit_debt_confidence: ratings.creditDebtConfidence ?? 1,
      retirement_confidence: ratings.retirementConfidence ?? 1,
      career_taxes_confidence: ratings.careerTaxesConfidence ?? 1,
      investing_confidence: ratings.investingConfidence ?? 1,
      primary_goal: primaryGoal
    }) },
    true
  );
}

export async function getLearningModules() {
  try {
    return (await request<ApiModule[]>("/api/lessons")).map(mapModule);
  } catch (error) {
    if (isBackendUnavailable(error)) return learningModules;
    throw error;
  }
}

export async function getLesson(id: string) {
  try {
    return mapLesson(await request<ApiLesson>(`/api/lessons/${encodeURIComponent(id)}`));
  } catch (error) {
    if (isBackendUnavailable(error)) {
      const local = findLesson(id);
      if (local) return local;
    }
    throw error;
  }
}

export async function completeLesson(id: string) {
  try {
    return await request<{ lessons_completed?: number }>(`/api/lessons/${encodeURIComponent(id)}/complete`, { method: "POST" }, true);
  } catch (error) {
    // Offline: lesson progress is tracked client-side after the quiz instead.
    if (isBackendUnavailable(error)) return {};
    throw error;
  }
}

export async function getQuizQuestions(lessonId: string): Promise<QuizQuestion[]> {
  try {
    return await request<QuizQuestion[]>(`/api/quizzes/${encodeURIComponent(lessonId)}`);
  } catch (error) {
    if (isBackendUnavailable(error)) {
      const category = findLesson(lessonId)?.category ?? "budgeting";
      return localQuizForCategory(category).map((question) => ({
        id: question.id,
        prompt: question.prompt,
        options: question.options,
        explanation: question.explanation
      }));
    }
    throw error;
  }
}

function gradeLocalQuiz(lessonId: string, answers: Record<string, number>): QuizAttemptResult {
  const category = findLesson(lessonId)?.category ?? "budgeting";
  const questions = localQuizForCategory(category);
  let correct = 0;
  const questionResults: QuizQuestionResult[] = questions.map((question) => {
    const isCorrect = answers[question.id] === question.correctIndex;
    if (isCorrect) correct += 1;
    return { id: question.id, correct: isCorrect, correctIndex: question.correctIndex, explanation: question.explanation };
  });
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  const passed = score >= 60;
  return {
    score,
    passed,
    earned: passed ? { water: 1, sunlight: 1 } : {},
    questionResults,
    local: true,
    category
  };
}

export async function submitQuizAttempt(lessonId: string, answers: Record<string, number>): Promise<QuizAttemptResult> {
  let result: ApiQuizAttempt;
  try {
    result = await request<ApiQuizAttempt>(`/api/quizzes/${encodeURIComponent(lessonId)}/attempts`, {
      method: "POST", body: JSON.stringify({ answers })
    }, true);
  } catch (error) {
    if (isBackendUnavailable(error)) return gradeLocalQuiz(lessonId, answers);
    throw error;
  }
  return {
    score: result.score,
    passed: result.passed,
    earned: result.earned ?? {},
    plant: result.updated_plant ? mapPlant(result.updated_plant) : undefined,
    profile: result.profile ? mapProfile(result.profile) : undefined,
    lessonsCompleted: result.lessons_completed,
    quizzesPassed: result.quizzes_passed,
    questionResults: (result.question_results ?? []).map((question) => ({
      id: String(question.id),
      correct: Boolean(question.correct),
      correctIndex: question.correct_index,
      explanation: question.explanation ?? undefined
    }))
  };
}

// ---------------------------------------------------------------------------
// Additive helpers (receipt scanning, questionnaire persistence, Sunflower).
// These are best-effort: they never throw, so demo-only features keep working
// even when the backend is unreachable or EXPO_PUBLIC_API_URL is unset.
// ---------------------------------------------------------------------------

export type QuestionnairePayload = {
  budgeting_confidence: number;
  savings_confidence: number;
  credit_debt_confidence: number;
  retirement_confidence: number;
  career_taxes_confidence: number;
  investing_confidence: number;
  primary_goal: string;
};

export async function submitQuestionnaireRemote(payload: QuestionnairePayload): Promise<void> {
  try {
    await request("/api/questionnaire", { method: "POST", body: JSON.stringify(payload) }, true);
  } catch {
    // best-effort only
  }
}

export async function askSunflowerRemote(question: string): Promise<string | null> {
  try {
    const data = await request<{ answer: string }>("/api/sunflower/ask", {
      method: "POST",
      body: JSON.stringify({ question })
    });
    return data.answer ?? null;
  } catch {
    return null;
  }
}

export type RemoteScanResult = ParsedReceipt & { source: "gemini" | "fallback" };

export async function scanReceiptRemote(imageBase64: string, mimeType = "image/jpeg"): Promise<RemoteScanResult | null> {
  try {
    const data = await request<RemoteScanResult>("/api/receipts/scan", {
      method: "POST",
      body: JSON.stringify({ image_base64: imageBase64, mime_type: mimeType })
    });
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}
