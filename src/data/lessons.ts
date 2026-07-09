import { LearningModule, Lesson } from "@/types/domain";

export const learningModules: LearningModule[] = [
  {
    id: "module_budgeting",
    category: "budgeting",
    flowerName: "Daisy",
    title: "Budgeting Basics",
    lessons: [
      {
        id: "budgeting-expected-actual",
        category: "budgeting",
        title: "Expected vs. Actual Spending",
        difficulty: "beginner",
        contentType: "reading",
        summary: "Learn why comparing planned spending with real spending is the main budgeting feedback loop.",
        reward: { sunlight: 1, water: 1 }
      },
      {
        id: "budgeting-categories",
        category: "budgeting",
        title: "Common Spending Categories",
        difficulty: "beginner",
        contentType: "reading",
        summary: "Group spending into savings, living expenses, education, lifestyle, debt, and taxes.",
        reward: { sunlight: 1 }
      }
    ]
  },
  {
    id: "module_savings",
    category: "savings",
    flowerName: "Marigold",
    title: "Savings + Emergency Fund",
    lessons: [
      {
        id: "savings-emergency-fund",
        category: "savings",
        title: "Why Emergency Funds Matter",
        difficulty: "beginner",
        contentType: "reading",
        summary: "Understand how emergency savings can reduce stress when unexpected expenses happen.",
        reward: { sunlight: 1, water: 1 }
      }
    ]
  },
  {
    id: "module_credit",
    category: "credit_debt",
    flowerName: "Rose",
    title: "Credit + Debt",
    lessons: [
      {
        id: "credit-apr",
        category: "credit_debt",
        title: "What Is APR?",
        difficulty: "beginner",
        contentType: "reading",
        summary: "APR is the yearly cost of borrowing money. Learn how it affects credit card balances.",
        reward: { sunlight: 1, water: 1 }
      }
    ]
  },
  {
    id: "module_retirement",
    category: "retirement",
    flowerName: "Orchid",
    title: "Retirement Accounts",
    lessons: [
      {
        id: "retirement-match",
        category: "retirement",
        title: "What Is a 401(k) Match?",
        difficulty: "intermediate",
        contentType: "reading",
        summary: "Learn the basic idea of employer retirement contributions without personalized advice.",
        reward: { sunlight: 1 }
      }
    ]
  },
  {
    id: "module_investing",
    category: "funds",
    flowerName: "Investment Flowers",
    title: "Risk / Return Ladder",
    lessons: [
      {
        id: "investing-risk-return",
        category: "funds",
        title: "Savings, Bonds, Funds, and Stocks",
        difficulty: "intermediate",
        contentType: "reading",
        summary: "Compare cash, bonds, funds, and stocks by general risk and return tradeoffs.",
        reward: { sunlight: 1, water: 1 }
      }
    ]
  }
];

export function findLesson(id: string | undefined): Lesson | undefined {
  return learningModules.flatMap((module) => module.lessons).find((lesson) => lesson.id === id);
}
