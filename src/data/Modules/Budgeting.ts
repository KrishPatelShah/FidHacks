import { LearningModule } from "@/types/domain"

export const BudgetingModule: LearningModule = {
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
        summary:
          "Learn why comparing planned spending with what actually happened is the foundation of every successful budget.",
        sourceUrl:
          "https://www.consumerfinance.gov/consumer-tools/budgeting/",
        reward: { sunlight: 1, water: 1 },
      },

      {
        id: "budgeting-needs-vs-wants",
        category: "budgeting",
        title: "Needs vs. Wants",
        difficulty: "beginner",
        contentType: "reading",
        summary:
          "Understand how to separate essential expenses from discretionary spending so you can make smarter financial decisions.",
        sourceUrl:
          "https://www.fidelity.com/learning-center/personal-finance/how-to-save-money",
        reward: { sunlight: 1, water: 1 },
      },

      {
        id: "budgeting-track-expenses",
        category: "budgeting",
        title: "Tracking Every Dollar",
        difficulty: "beginner",
        contentType: "reading",
        summary:
          "Discover practical ways to record your income and expenses so your budget reflects reality instead of guesses.",
        sourceUrl:
          "https://www.consumerfinance.gov/consumer-tools/track-your-spending/",
        reward: { sunlight: 2, water: 1 },
      },

      {
        id: "budgeting-fixed-variable",
        category: "budgeting",
        title: "Fixed vs. Variable Expenses",
        difficulty: "beginner",
        contentType: "reading",
        summary:
          "Learn which expenses stay consistent each month and which fluctuate so you can plan with confidence.",
        sourceUrl:
          "https://www.nerdwallet.com/article/finance/fixed-and-variable-expenses",
        reward: { sunlight: 2, water: 1 },
      },

      {
        id: "budgeting-first-budget",
        category: "budgeting",
        title: "Creating Your First Budget",
        difficulty: "beginner",
        contentType: "reading",
        summary:
          "Combine your income, expenses, and financial priorities into your first complete monthly budget.",
        sourceUrl:
          "https://www.fidelity.com/learning-center/personal-finance/budgeting-basics",
        reward: { sunlight: 2, water: 2 },
      },

      {
        id: "budgeting-budget-methods",
        category: "budgeting",
        title: "Choosing a Budgeting Method",
        difficulty: "intermediate",
        contentType: "reading",
        summary:
          "Explore budgeting approaches such as percentage-based budgeting and zero-based budgeting to find what works best for you.",
        sourceUrl:
          "https://www.consumerfinance.gov/about-us/blog/budgeting-how-to-create-a-budget-and-stick-to-it/",
        reward: { sunlight: 2, water: 2 },
      },

      {
        id: "budgeting-emergency-fund",
        category: "budgeting",
        title: "Building an Emergency Fund",
        difficulty: "intermediate",
        contentType: "reading",
        summary:
          "Learn how emergency savings protect your budget from unexpected expenses and reduce financial stress.",
        sourceUrl:
          "https://www.fidelity.com/learning-center/smart-money/emergency-fund",
        reward: { sunlight: 3, water: 2 },
      },

      {
        id: "budgeting-irregular-expenses",
        category: "budgeting",
        title: "Planning for Irregular Expenses",
        difficulty: "intermediate",
        contentType: "reading",
        summary:
          "Prepare for expenses like holidays, insurance, car repairs, and annual subscriptions before they disrupt your budget.",
        sourceUrl:
          "https://www.consumerfinance.gov/about-us/blog/how-to-plan-for-unexpected-expenses/",
        reward: { sunlight: 3, water: 2 },
      },

      {
        id: "budgeting-budget-optimization",
        category: "budgeting",
        title: "Improving Your Budget",
        difficulty: "intermediate",
        contentType: "reading",
        summary:
          "Analyze spending trends, adjust categories, and continuously improve your budget as your financial goals change.",
        sourceUrl:
          "https://www.fidelity.com/learning-center/personal-finance/saving-and-budgeting-money",
        reward: { sunlight: 3, water: 3 },
      },

      {
        id: "budgeting-long-term-plan",
        category: "budgeting",
        title: "Budgeting for Long-Term Success",
        difficulty: "intermediate",
        contentType: "reading",
        summary:
          "Bring everything together by creating a sustainable budget that supports saving, investing, debt repayment, and future financial goals.",
        sourceUrl:
          "https://www.fidelity.com/learning-center/personal-finance/money-management",
        reward: { sunlight: 5, water: 5 },
      },
    ]
}