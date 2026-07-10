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
        "Learn how emergency savings protect you from unexpected expenses and provide financial security when life changes.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/smart-money/emergency-fund",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "savings-saving-goals",
      category: "savings",
      title: "Setting Savings Goals",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how creating clear short-term and long-term savings goals helps you stay motivated and make better financial decisions.",
      sourceUrl:
        "https://www.consumerfinance.gov/consumer-tools/saving-money/",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "savings-pay-yourself-first",
      category: "savings",
      title: "Pay Yourself First",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn why saving before spending is a powerful habit and how prioritizing savings can improve financial stability.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/5-ways-to-save-more",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "savings-automation",
      category: "savings",
      title: "Automating Your Savings",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand how automatic transfers and consistent contributions make saving easier and more reliable.",
      sourceUrl:
        "https://www.consumerfinance.gov/about-us/blog/how-automating-your-savings-can-help-you/",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "savings-right-account",
      category: "savings",
      title: "Choosing the Right Savings Account",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Compare savings accounts, money market accounts, and other cash options to understand where your money can safely grow.",
      sourceUrl:
        "https://www.fdic.gov/resources/consumers/money-smart/",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "savings-how-much",
      category: "savings",
      title: "How Much Should You Save?",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn how to estimate an emergency fund target based on your expenses, income stability, and personal situation.",
      sourceUrl:
        "https://www.fidelity.com/viewpoints/personal-finance/save-for-an-emergency",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "savings-sinking-funds",
      category: "savings",
      title: "Using Sinking Funds",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn how setting aside money for planned expenses prevents future financial stress.",
      sourceUrl:
        "https://www.nerdwallet.com/article/finance/what-is-a-sinking-fund",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "savings-growing-savings",
      category: "savings",
      title: "Making Your Savings Grow",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Explore how interest, compound growth, and smart account choices can help your savings increase over time.",
      sourceUrl:
        "https://www.investor.gov/introduction-investing/investing-basics/compound-interest",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "savings-common-mistakes",
      category: "savings",
      title: "Avoiding Savings Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify common mistakes like inconsistent saving, relying too much on credit, and failing to plan for expenses.",
      sourceUrl:
        "https://www.consumerfinance.gov/consumer-tools/budgeting/",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "savings-building-wealth",
      category: "savings",
      title: "From Saving to Investing",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn when your emergency savings are established and why investing becomes the next step toward building long-term wealth.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/trading-investing/investing-for-beginners",
      reward: { sunlight: 5, water: 5 },
    },
  ],
};