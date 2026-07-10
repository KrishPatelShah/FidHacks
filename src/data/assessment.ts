import { ConfidenceAssessment, ConfidenceLevel } from "@/types/domain";

export const assessmentTitle = "Financial Confidence Assessment";

export const assessmentSubtitle =
  "Help us personalize your experience. Rate how confident you feel in each area below. There are no right or wrong answers.";

export const likertLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Not Confident at All",
  2: "Slightly Confident",
  3: "Somewhat Confident",
  4: "Confident",
  5: "Very Confident"
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
};

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: "monthly_budget", prompt: "Create and stick to a monthly budget." },
  { id: "track_spending", prompt: "Track where your money goes and identify areas to spend less." },
  { id: "emergency_savings", prompt: "Save money for unexpected expenses." },
  { id: "credit_basics", prompt: "Understand credit cards, credit scores, and interest." },
  { id: "investing_basics", prompt: "Understand the basics of investing (stocks, bonds, ETFs, mutual funds)." },
  { id: "retirement_accounts", prompt: "Understand retirement accounts (401(k), employer match, Roth IRA)." },
  { id: "job_offer", prompt: "Evaluate a job offer based on salary, benefits, taxes, and long-term value." },
  { id: "compare_options", prompt: "Make informed financial decisions by comparing options." },
  { id: "trustworthy_info", prompt: "Know where to find trustworthy financial information." },
  { id: "overall_confidence", prompt: "Feel confident managing your finances and reaching your financial goals." }
];

export const levelCopy: Record<
  ConfidenceLevel,
  { emoji: string; title: string; description: string }
> = {
  Beginner: {
    emoji: "🌱",
    title: "Beginner",
    description:
      "You're just getting started, and that's a great place to be. We'll begin with budgeting basics, simple money habits, and friendly explanations so your garden can grow at a comfortable pace."
  },
  Intermediate: {
    emoji: "🌿",
    title: "Intermediate",
    description:
      "You already have solid money foundations. We'll mix habit-building with deeper topics like credit, saving goals, and early investing so your garden keeps expanding."
  },
  Advanced: {
    emoji: "🌳",
    title: "Advanced",
    description:
      "You're confident across many money topics. We'll focus on refining decisions, retirement accounts, and investing concepts so you can keep growing with more advanced flowers."
  }
};

/** Shape ready to sync to the backend / Firebase later. */
export type AssessmentPayload = ConfidenceAssessment & {
  userId?: string;
  version: 1;
};
