import { BudgetCategory, BudgetEntry } from "@/types/domain";

export const budgetCategories: Record<BudgetCategory, string> = {
  savings_investments: "Savings and Investments",
  living_expenses: "Living Expenses",
  education_career: "Education and Career",
  lifestyle: "Lifestyle",
  debt: "Debt",
  taxes: "Taxes"
};

export const sampleBudgetEntries: BudgetEntry[] = [
  { id: "budget_1", userId: "demo_user", category: "savings_investments", expectedAmount: 300, actualAmount: 250, month: "2026-07" },
  { id: "budget_2", userId: "demo_user", category: "living_expenses", expectedAmount: 1200, actualAmount: 1250, month: "2026-07" },
  { id: "budget_3", userId: "demo_user", category: "education_career", expectedAmount: 200, actualAmount: 180, month: "2026-07" },
  { id: "budget_4", userId: "demo_user", category: "lifestyle", expectedAmount: 250, actualAmount: 420, month: "2026-07" },
  { id: "budget_5", userId: "demo_user", category: "debt", expectedAmount: 160, actualAmount: 160, month: "2026-07" },
  { id: "budget_6", userId: "demo_user", category: "taxes", expectedAmount: 500, actualAmount: 500, month: "2026-07" }
];
