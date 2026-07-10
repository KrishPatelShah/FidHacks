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
        "Learn what credit is, why it exists, and how responsible borrowing can help you achieve financial goals.",
      sourceUrl:
        "https://www.consumerfinance.gov/consumer-tools/credit-cards/",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "credit-credit-score",
      category: "credit_debt",
      title: "Understanding Credit Scores",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Discover how credit scores are calculated and why they influence loans, housing, and financial opportunities.",
      sourceUrl:
        "https://www.myfico.com/credit-education/what-is-a-fico-score",
      reward: { sunlight: 1, water: 1 },
    },

    {
      id: "credit-credit-report",
      category: "credit_debt",
      title: "Reading Your Credit Report",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Explore what information appears on your credit report and why regularly checking it helps protect your financial health.",
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
        "Understand Annual Percentage Rate (APR), how interest works, and why carrying balances can become expensive.",
      sourceUrl:
        "https://gosunward.org/articles/apr-meaning/",
      reward: { sunlight: 2, water: 1 },
    },

    {
      id: "credit-credit-cards",
      category: "credit_debt",
      title: "Using Credit Cards Wisely",
      difficulty: "beginner",
      contentType: "reading",
      summary:
        "Learn how to use credit cards responsibly while avoiding unnecessary interest, fees, and debt.",
      sourceUrl:
        "https://www.greenpath.com/blog/using-credit-cards-wisely/",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "credit-debt-types",
      category: "credit_debt",
      title: "Good Debt vs. Bad Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Compare common forms of debt including student loans, mortgages, auto loans, and credit cards.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/smart-money/good-debt-vs-bad-debt",
      reward: { sunlight: 2, water: 2 },
    },

    {
      id: "credit-paying-off-debt",
      category: "credit_debt",
      title: "Strategies to Pay Off Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Learn repayment strategies such as the debt snowball and debt avalanche methods.",
      sourceUrl:
        "https://dfpi.ca.gov/news/insights/three-steps-to-managing-and-getting-out-of-debt/",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "credit-improve-score",
      category: "credit_debt",
      title: "Improving Your Credit Score",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Discover habits that improve credit scores, including payment history, credit utilization, and responsible borrowing.",
      sourceUrl:
        "https://www.experian.com/blogs/ask-experian/ways-to-improve-credit/",
      reward: { sunlight: 3, water: 2 },
    },

    {
      id: "credit-avoid-mistakes",
      category: "credit_debt",
      title: "Avoiding Common Credit Mistakes",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Identify mistakes that damage credit, such as missed payments, high balances, and excessive applications.",
      sourceUrl:
        "https://www.experian.com/blogs/ask-experian/common-credit-mistakes-to-avoid/",
      reward: { sunlight: 3, water: 3 },
    },

    {
      id: "credit-mastering-credit",
      category: "credit_debt",
      title: "Mastering Credit & Debt",
      difficulty: "intermediate",
      contentType: "reading",
      summary:
        "Combine credit knowledge, debt strategies, and responsible borrowing habits into a long-term financial approach.",
      sourceUrl:
        "https://www.fidelity.com/learning-center/personal-finance/managing-debt",
      reward: { sunlight: 5, water: 5 },
    },
  ],
};