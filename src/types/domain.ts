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

export type SpendCategory = "needs" | "wants" | "save" | "income";

export type TransactionSource = "scanned" | "manual";

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  category: SpendCategory;
  source: TransactionSource;
  date: string;
  note?: string;
};

export type RiskProfile = "Conservative" | "Moderate" | "Aggressive";

export type Etf = {
  symbol: string;
  name: string;
  category: PlantCategory;
  flowerName: string;
  price: number;
  changePct: number;
  spark: number[];
  riskLabel: string;
  fitsProfiles: RiskProfile[];
  why: string;
  info: string;
};

export type AchievementMetric =
  | "flowersGrown"
  | "streak"
  | "totalFlowers"
  | "budgetsLogged"
  | "quizzesPassed"
  | "lessonsCompleted"
  | "investmentsPlanted";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  metric: AchievementMetric;
  goal: number;
};
