import AsyncStorage from "@react-native-async-storage/async-storage";
import { LearningModule, Lesson, Plant, UserProfile } from "@/types/domain";

const TOKEN_KEY = "financial_garden_access_token";
const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
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

export type QuizQuestion = { id: string; prompt: string; options: string[]; explanation?: string };
export type QuizAttemptResult = {
  score: number;
  passed: boolean;
  earned: { sunlight?: number; water?: number; fertilizer?: number };
  plant?: Plant;
  profile?: UserProfile;
  lessonsCompleted?: number;
  quizzesPassed?: number;
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
  const response = await request<{ access_token: string }>("/api/auth/demo", { method: "POST" });
  await AsyncStorage.setItem(TOKEN_KEY, response.access_token);
  return response.access_token;
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
  return (await request<ApiModule[]>("/api/lessons")).map(mapModule);
}

export async function getLesson(id: string) {
  return mapLesson(await request<ApiLesson>(`/api/lessons/${encodeURIComponent(id)}`));
}

export async function completeLesson(id: string) {
  return request<{ lessons_completed?: number }>(`/api/lessons/${encodeURIComponent(id)}/complete`, { method: "POST" }, true);
}

export async function getQuizQuestions(lessonId: string) {
  return request<QuizQuestion[]>(`/api/quizzes/${encodeURIComponent(lessonId)}`);
}

export async function submitQuizAttempt(lessonId: string, answers: Record<string, number>): Promise<QuizAttemptResult> {
  const result = await request<any>(`/api/quizzes/${encodeURIComponent(lessonId)}/attempts`, {
    method: "POST", body: JSON.stringify({ answers })
  }, true);
  return {
    score: result.score,
    passed: result.passed,
    earned: result.earned ?? {},
    plant: (result.plant ?? result.updated_plant) ? mapPlant(result.plant ?? result.updated_plant) : undefined,
    profile: result.profile ? mapProfile(result.profile) : undefined,
    lessonsCompleted: result.lessons_completed,
    quizzesPassed: result.quizzes_passed
  };
}
