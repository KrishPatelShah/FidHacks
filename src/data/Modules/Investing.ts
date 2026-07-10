import { LearningModule } from "@/types/domain";

export const InvestingModule: LearningModule = {
  id: "module_investing",
  category: "funds",
  flowerName: "Investment Flowers",
  title: "Risk / Return Ladder",
  lessons: [
    {
      id: "investing-why-invest",
      category: "funds",
      title: "Why Invest?",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why investing helps grow wealth over time and how it differs from simply saving money.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/investing-for-beginners",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "investing-compound-growth",
      category: "funds",
      title: "Compound Growth",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand how investments can grow over time as your earnings generate additional earnings.",
      sourceUrl:
        "https://www.fiducientadvisors.com/blog/the-power-of-compounding-how-time-can-be-your-best-investment-ally",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "investing-risk-return",
      category: "funds",
      title: "Risk vs. Return",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand why investments with higher potential returns usually involve greater risk.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/risk-tolerance",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "investing-asset-classes",
      category: "funds",
      title: "Stocks, Bonds, and Cash",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare major investment categories and learn how stocks, bonds, and cash serve different purposes.",
      sourceUrl:
        "https://www.investor.gov/introduction-investing/investing-basics/investment-products",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "investing-diversification",
      category: "funds",
      title: "Diversification",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why spreading investments across different assets can help manage risk.",
      sourceUrl:
        "https://www.fidelity.com/viewpoints/investing-ideas/guide-to-diversification",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "investing-mutual-funds",
      category: "funds",
      title: "Mutual Funds vs. ETFs",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare mutual funds and ETFs and understand how investors use them to create diversified portfolios.",
      sourceUrl:
        "https://www.fidelity.com/viewpoints/investing-ideas/mutual-fund-or-etf",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "investing-index-funds",
      category: "funds",
      title: "What Are Index Funds?",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn how index funds track market indexes and why many long-term investors choose passive investing strategies.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/smart-money/what-is-an-index-fund",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "investing-risk-tolerance",
      category: "funds",
      title: "Finding Your Risk Level",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Discover how your goals, timeline, and comfort with market changes affect investment decisions.",
      sourceUrl:
        "https://www.mheducation.com/highered/blog/2025/06/whats-your-risk-tolerance-how-to-figure-it-out-before-you-invest.html",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "investing-long-term",
      category: "funds",
      title: "Investing for the Long Term",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn why patience, consistency, and avoiding emotional decisions are important for successful investing.",
      sourceUrl:
        "https://www.bny.com/wealth/global/en/insights/benefits-of-investing.html",
      reward: { sunlight: 4, water: 3 },
    },

    {
      id: "investing-building-portfolio",
      category: "funds",
      title: "Building Your First Portfolio",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Combine asset allocation, diversification, and risk management to understand how a simple portfolio is created.",
      sourceUrl:
        "https://www.ml.com/articles/how-to-build-investment-portfolio.html",
      reward: { sunlight: 5, water: 5 },
    },
  ],
};
