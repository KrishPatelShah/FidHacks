import { LearningModule } from "@/types/domain";

export const SavingsModule: LearningModule = {
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
      summary:
        "Learn how emergency savings protect you from life's unexpected expenses and provide financial peace of mind.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/save-for-an-emergency",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "savings-saving-goals",
      category: "savings",
      title: "Setting Savings Goals",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how setting clear short-, medium-, and long-term savings goals makes it easier to stay motivated.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/saving-and-budgeting-money",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "savings-pay-yourself-first",
      category: "savings",
      title: "Pay Yourself First",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why saving before spending is one of the simplest habits for building wealth over time.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/how-to-save-money",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "savings-automation",
      category: "savings",
      title: "Automating Your Savings",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "See how automatic transfers and direct deposits can help you save consistently without relying on willpower.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/automate-your-savings",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "savings-right-account",
      category: "savings",
      title: "Choosing the Right Savings Account",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare traditional savings accounts, high-yield savings accounts, and money market accounts to find the best place for your cash.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/high-yield-savings",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "savings-how-much",
      category: "savings",
      title: "How Much Should You Save?",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Understand common savings benchmarks, including emergency fund recommendations based on your lifestyle and income.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/save-for-an-emergency",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "savings-sinking-funds",
      category: "savings",
      title: "Using Sinking Funds",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn how setting aside money for planned future expenses prevents them from becoming financial emergencies.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/saving-and-budgeting-money",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "savings-growing-savings",
      category: "savings",
      title: "Making Your Savings Grow",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Explore how interest, high-yield accounts, and compound growth can help your savings increase over time.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/compound-interest",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "savings-common-mistakes",
      category: "savings",
      title: "Avoiding Savings Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify common savings pitfalls like inconsistent contributions, dipping into emergency funds, and setting unrealistic goals.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/saving-and-budgeting-money",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "savings-building-wealth",
      category: "savings",
      title: "From Saving to Investing",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn when you've saved enough for emergencies and why investing is the next step toward building long-term wealth.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/wealth-management-insights/why-invest",
      reward: { sunlight: 5, water: 5 },
    },
  ],
}