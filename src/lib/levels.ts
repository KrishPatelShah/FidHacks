import { ExperienceLevel, PlantCategory } from "@/types/domain";

export const levelRank: Record<ExperienceLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2
};

// Categories a user can actively work on at each level (cumulative).
// Beginner: money-management basics. Intermediate: adds low-risk investing.
// Advanced: adds mutual funds, individual stocks, and career/negotiation.
export const levelCategories: Record<ExperienceLevel, PlantCategory[]> = {
  beginner: ["budgeting", "savings", "credit_debt", "cash"],
  intermediate: ["budgeting", "savings", "credit_debt", "cash", "bonds", "retirement"],
  advanced: [
    "budgeting",
    "savings",
    "credit_debt",
    "cash",
    "bonds",
    "retirement",
    "funds",
    "stocks",
    "career_taxes"
  ]
};

export function canAccessCategory(level: ExperienceLevel, category: PlantCategory): boolean {
  return levelCategories[level].includes(category);
}

// The investing (Stocks) tab is locked entirely until the Intermediate level.
export function investingUnlocked(level: ExperienceLevel): boolean {
  return levelRank[level] >= levelRank.intermediate;
}

// Whether content of a given difficulty is available to this level.
export function difficultyUnlocked(level: ExperienceLevel, difficulty: ExperienceLevel): boolean {
  return levelRank[level] >= levelRank[difficulty];
}
