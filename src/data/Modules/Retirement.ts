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
        "Learn why retirement planning starts early and how small contributions today can grow into meaningful savings over time.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/retirement/retirement-planning",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "retirement-compound-growth",
      category: "retirement",
      title: "The Power of Compound Growth",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how earning returns on your previous returns makes starting early one of the biggest advantages in retirement saving.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/compound-interest",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "retirement-account-types",
      category: "retirement",
      title: "Understanding Retirement Accounts",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare common retirement accounts like 401(k)s, Traditional IRAs, and Roth IRAs to understand their purpose and key differences.",
      sourceUrl: "https://www.fidelity.com/retirement-ira/overview",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "retirement-401k",
      category: "retirement",
      title: "How a 401(k) Works",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn how workplace retirement plans help employees save for retirement through automatic payroll contributions.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/401k-basics",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "retirement-match",
      category: "retirement",
      title: "What Is a 401(k) Match?",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand how employer matching works and why contributing enough to receive the full match is often considered a valuable employee benefit.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/401k-match",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "retirement-roth-vs-traditional",
      category: "retirement",
      title: "Roth vs. Traditional",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare Roth and Traditional retirement accounts by exploring when taxes are paid and how withdrawals differ.",
      sourceUrl:
        "https://www.fidelity.com/retirement-ira/roth-vs-traditional-ira",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "retirement-contribution-limits",
      category: "retirement",
      title: "Contribution Limits",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn why retirement accounts have annual contribution limits and how they encourage long-term investing.",
      sourceUrl:
        "https://www.fidelity.com/retirement-ira/contribution-limits-deadlines",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "retirement-withdrawals",
      category: "retirement",
      title: "Withdrawal Rules",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Understand when retirement savings can typically be withdrawn and why early withdrawals may have taxes or penalties.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/retirement/retirement-withdrawals",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "retirement-common-mistakes",
      category: "retirement",
      title: "Avoiding Retirement Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify common retirement planning mistakes, including delaying contributions, missing employer matches, and withdrawing savings too early.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/retirement",
      reward: { sunlight: 4, water: 3 },
    },

    {
      id: "retirement-building-plan",
      category: "retirement",
      title: "Building Your Retirement Plan",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Bring everything together by creating a long-term retirement savings strategy that evolves throughout your career.",
      sourceUrl: "https://www.fidelity.com/retirement-planning/overview",
      reward: { sunlight: 5, water: 5 },
    },
  ],
};
