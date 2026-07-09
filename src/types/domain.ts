export type PlantCategory =
  | "budgeting"
  | "savings"
  | "credit_debt"
  | "retirement"
  | "career_taxes"
  | "cash"
  | "bonds"
  | "funds"
  | "stocks";

export type Plant = {
  id: string;
  userId: string;
  type: PlantCategory;
  flowerName: string;
  stage: number;
  growth: number;
  quantity: number;
  water: number;
  sunlight: number;
  fertilizer: number;
  unlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  displayName: string;
  streakCount: number;
  lastActivityDate: string;
  currentPath: "beginner" | "intermediate" | "advanced";
  gardenVisibility: "private" | "friends" | "public";
};

export type BudgetCategory =
  | "savings_investments"
  | "living_expenses"
  | "education_career"
  | "lifestyle"
  | "debt"
  | "taxes";

export type BudgetEntry = {
  id: string;
  userId: string;
  category: BudgetCategory;
  expectedAmount: number;
  actualAmount: number;
  month: string;
};

export type Lesson = {
  id: string;
  category: PlantCategory;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  contentType: "video" | "reading" | "interactive";
  sourceUrl?: string;
  summary: string;
  reward: {
    sunlight?: number;
    water?: number;
    fertilizer?: number;
  };
};

export type LearningModule = {
  id: string;
  category: PlantCategory;
  flowerName: string;
  title: string;
  lessons: Lesson[];
};
