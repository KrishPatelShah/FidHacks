import { LearningModule } from "@/types/domain";

export const RetirementModule: LearningModule = {
  id: "module_retirement",
  category: "retirement",
  flowerName: "Orchid",
  title: "Retirement Accounts",
  lessons: [
    {
      id: "retirement-why-save",
      category: "retirement",
      title: "Why Save for Retirement?",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why retirement planning starts early and how consistent contributions can grow into meaningful savings over time.",
      sourceUrl:
        "https://www.fidelity.com/retirement/retirement-planning",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "retirement-compound-growth",
      category: "retirement",
      title: "The Power of Compound Growth",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how investment growth can accelerate over time and why starting early is one of the biggest advantages in retirement planning.",
      sourceUrl:
        "https://www.investor.gov/introduction-investing/investing-basics/compound-interest",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "retirement-account-types",
      category: "retirement",
      title: "Understanding Retirement Accounts",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare retirement accounts such as 401(k)s, Traditional IRAs, and Roth IRAs and understand their different purposes.",
      sourceUrl:
        "https://www.fidelity.com/retirement-ira/overview",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "retirement-401k",
      category: "retirement",
      title: "How a 401(k) Works",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn how employer-sponsored retirement plans allow employees to save automatically through payroll contributions.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/retirement/401k-benefits",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "retirement-match",
      category: "retirement",
      title: "What Is a 401(k) Match?",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand how employer contributions work and why taking advantage of a company match can accelerate retirement savings.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/retirement/401k-benefits",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "retirement-roth-vs-traditional",
      category: "retirement",
      title: "Roth vs. Traditional",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare Roth and Traditional retirement accounts by learning when taxes are paid and how withdrawals work.",
      sourceUrl:
        "https://www.fidelity.com/retirement-ira/roth-ira",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "retirement-contribution-limits",
      category: "retirement",
      title: "Contribution Limits",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn why retirement accounts have yearly contribution limits and how they affect retirement savings strategies.",
      sourceUrl:
        "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "retirement-withdrawals",
      category: "retirement",
      title: "Withdrawal Rules",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Understand retirement withdrawal rules, taxes, and why accessing retirement money early may have consequences.",
      sourceUrl:
        "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "retirement-common-mistakes",
      category: "retirement",
      title: "Avoiding Retirement Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify common retirement mistakes such as waiting too long to save, missing employer benefits, or ignoring investment choices.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/wealth-management-insights/retirement-master-plan",
      reward: { sunlight: 4, water: 3 },
    },

    {
      id: "retirement-building-plan",
      category: "retirement",
      title: "Building Your Retirement Plan",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Combine retirement accounts, contributions, investing, and long-term goals into a complete retirement strategy.",
      sourceUrl:
        "https://www.fidelity.com/retirement-planning/plan-for-retirement",
      reward: { sunlight: 5, water: 5 },
    },
  ],
};