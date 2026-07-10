import { PlantCategory } from "@/types/domain";

export type LocalQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// Category-based quiz bank used as an offline fallback when the FastAPI backend
// is unreachable. Each lesson maps to its category's questions so the learning
// flow (and garden growth reward) keeps working without a server.
const bank: Partial<Record<PlantCategory, LocalQuizQuestion[]>> = {
  budgeting: [
    {
      id: "budgeting-q1",
      prompt: "Why compare expected spending with actual spending?",
      options: ["To shame yourself for mistakes", "To find useful habit patterns", "To calculate a credit score"],
      correctIndex: 1,
      explanation: "The gap between planned and real spending is a learning signal that helps explain what changed."
    },
    {
      id: "budgeting-q2",
      prompt: "Which of these is a 'need' rather than a 'want'?",
      options: ["A streaming subscription", "Rent or housing", "A concert ticket"],
      correctIndex: 1,
      explanation: "Needs are essential expenses like housing, food, and utilities; wants are discretionary."
    }
  ],
  savings: [
    {
      id: "savings-q1",
      prompt: "What is an emergency fund for?",
      options: ["Expected and unexpected essential expenses", "Only investing", "Increasing credit limits"],
      correctIndex: 0,
      explanation: "Emergency savings help absorb essential expenses without relying on debt."
    },
    {
      id: "savings-q2",
      prompt: "A common starting goal for an emergency fund is:",
      options: ["3-6 months of expenses", "10 years of income", "Exactly $50"],
      correctIndex: 0,
      explanation: "Many guidelines suggest building toward 3-6 months of living expenses over time."
    }
  ],
  credit_debt: [
    {
      id: "credit-q1",
      prompt: "What does APR describe?",
      options: ["The yearly cost of borrowing", "A bank account balance", "A credit score"],
      correctIndex: 0,
      explanation: "APR communicates the annualized cost of borrowing money."
    },
    {
      id: "credit-q2",
      prompt: "Which habit generally helps your credit score?",
      options: ["Paying bills on time", "Maxing out every card", "Missing payments"],
      correctIndex: 0,
      explanation: "On-time payments are one of the biggest positive factors in a credit score."
    }
  ],
  retirement: [
    {
      id: "retirement-q1",
      prompt: "What is the usual purpose of a retirement account?",
      options: ["Long-term retirement saving", "Daily spending", "Avoiding every tax"],
      correctIndex: 0,
      explanation: "These accounts are designed to support long-term retirement saving goals."
    },
    {
      id: "retirement-q2",
      prompt: "An employer match on a 401(k) is best described as:",
      options: ["Free money toward retirement", "A loan you repay", "A penalty"],
      correctIndex: 0,
      explanation: "An employer match adds money to your retirement savings when you contribute."
    }
  ],
  funds: [
    {
      id: "funds-q1",
      prompt: "What does diversification aim to do?",
      options: ["Spread investment exposure", "Guarantee returns", "Remove all risk"],
      correctIndex: 0,
      explanation: "Diversification can reduce concentration risk, but it cannot remove all investment risk."
    },
    {
      id: "funds-q2",
      prompt: "An index fund is designed to:",
      options: ["Track a market index", "Beat the market every year", "Avoid all fees"],
      correctIndex: 0,
      explanation: "Index funds aim to track the performance of a market index at low cost."
    }
  ]
};

const defaultQuiz: LocalQuizQuestion[] = [
  {
    id: "general-q1",
    prompt: "What is a healthy first step toward financial confidence?",
    options: ["Understanding where your money goes", "Ignoring your statements", "Borrowing to invest"],
    correctIndex: 0,
    explanation: "Awareness of your income and spending is the foundation of every money skill."
  }
];

export function localQuizForCategory(category: PlantCategory): LocalQuizQuestion[] {
  return bank[category] ?? defaultQuiz;
}
