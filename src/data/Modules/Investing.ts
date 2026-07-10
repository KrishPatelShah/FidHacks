import { LearningModule } from "@/types/domain";

export const InvestingModule: LearningModule = 
{
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
        "https://www.fidelity.com/learning-center/trading-investing/why-invest",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "investing-compound-growth",
      category: "funds",
      title: "Compound Growth",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "See how investments can grow through compounding, allowing your earnings to generate additional earnings over time.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/compound-interest",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "investing-risk-return",
      category: "funds",
      title: "Risk vs. Return",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand the relationship between investment risk and potential return, and why every investment involves tradeoffs.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/risk-tolerance",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "investing-asset-classes",
      category: "funds",
      title: "Savings, Bonds, Funds, and Stocks",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare cash, bonds, mutual funds, ETFs, and stocks by their typical risk, return, and purpose within a portfolio.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/investing-basics",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "investing-diversification",
      category: "funds",
      title: "Diversification",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why spreading investments across different assets can reduce risk without eliminating growth opportunities.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/diversification",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "investing-mutual-funds",
      category: "funds",
      title: "Mutual Funds vs. ETFs",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare mutual funds and exchange-traded funds (ETFs), including how they're managed and when each might be appropriate.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/investment-products/etf/etfs-vs-mutual-funds",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "investing-index-funds",
      category: "funds",
      title: "What Are Index Funds?",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Discover how index funds work, why they're popular with long-term investors, and how they differ from actively managed funds.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/index-funds",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "investing-risk-tolerance",
      category: "funds",
      title: "Knowing Your Risk Tolerance",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Understand how your age, financial goals, and comfort with market swings influence your investment choices.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/risk-tolerance",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "investing-long-term",
      category: "funds",
      title: "Thinking Long Term",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn why successful investing often means staying invested through market ups and downs instead of reacting emotionally.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/long-term-investing",
      reward: { sunlight: 4, water: 3 },
    },

    {
      id: "investing-building-portfolio",
      category: "funds",
      title: "Building Your First Portfolio",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Bring together diversification, asset allocation, and long-term thinking to understand how a simple investment portfolio is constructed.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/asset-allocation",
      reward: { sunlight: 5, water: 5 },
    },
  ],
}
