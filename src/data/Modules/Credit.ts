import { LearningModule } from "@/types/domain";

export const CreditModule: LearningModule = {
  id: "module_credit",
  category: "credit_debt",
  flowerName: "Rose",
  title: "Credit + Debt",
  lessons: [
    {
      id: "credit-what-is-credit",
      category: "credit_debt",
      title: "Understanding Credit",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn what credit is, why it exists, and how borrowing money responsibly can help you achieve financial goals.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/what-is-credit",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "credit-credit-score",
      category: "credit_debt",
      title: "Understanding Credit Scores",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how credit scores are calculated and why they affect everything from loans to apartment applications.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/credit-score",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "credit-credit-report",
      category: "credit_debt",
      title: "Reading Your Credit Report",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Explore what information appears on your credit report and why reviewing it regularly is important.",
      sourceUrl:
        "https://www.annualcreditreport.com/index.action",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "credit-apr",
      category: "credit_debt",
      title: "What Is APR?",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Understand Annual Percentage Rate (APR), how interest is charged, and why carrying a balance can become expensive.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/credit-card-interest",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "credit-credit-cards",
      category: "credit_debt",
      title: "Using Credit Cards Wisely",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn best practices for using credit cards responsibly while avoiding unnecessary interest and fees.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/credit-card-tips",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "credit-debt-types",
      category: "credit_debt",
      title: "Good Debt vs. Bad Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare common forms of debt—including student loans, mortgages, auto loans, and credit cards—to understand when borrowing can be beneficial.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/managing-debt",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "credit-paying-off-debt",
      category: "credit_debt",
      title: "Strategies to Pay Off Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn popular repayment strategies like the debt snowball and debt avalanche methods to become debt-free faster.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/pay-off-debt",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "credit-improve-score",
      category: "credit_debt",
      title: "Improving Your Credit Score",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Discover practical habits that can strengthen your credit score over time, including payment history and credit utilization.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/improve-credit-score",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "credit-avoid-mistakes",
      category: "credit_debt",
      title: "Avoiding Common Credit Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify common mistakes that can hurt your credit, such as missed payments, maxing out cards, and applying for too much credit at once.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/managing-debt",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "credit-mastering-credit",
      category: "credit_debt",
      title: "Mastering Credit & Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Bring everything together by building a long-term strategy for maintaining healthy credit while using debt as a financial tool—not a financial burden.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance",
      reward: { sunlight: 5, water: 5 },
    },
  ],
}