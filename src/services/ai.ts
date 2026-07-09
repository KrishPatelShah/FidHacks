type Topic = {
  keywords: string[];
  answer: string;
};

const topics: Topic[] = [
  {
    keywords: ["spent more", "expected", "overspend", "over spend", "actual"],
    answer:
      "Your actual spending can differ from your plan because real life changes week to week. Find the category with the biggest gap, ask what changed, then adjust next week's plan. A good next lesson is Expected vs. Actual Spending."
  },
  {
    keywords: ["apr", "interest rate"],
    answer:
      "APR is the yearly cost of borrowing money, shown as a percentage. On a credit card, carrying a balance means interest is added over time, so purchases can end up costing more than the sticker price."
  },
  {
    keywords: ["roth", "ira"],
    answer:
      "A Roth IRA is a retirement account where you contribute money you've already paid taxes on, so qualified withdrawals in retirement can be tax-free. This is general education, not personal tax advice."
  },
  {
    keywords: ["401", "employer match", "match"],
    answer:
      "A 401(k) is a retirement account often offered through work. An employer match means your employer adds money when you contribute, up to a limit. Many people try to contribute at least enough to get the full match."
  },
  {
    keywords: ["stock", "bond", "vs bonds", "difference between stocks"],
    answer:
      "Stocks represent ownership in a company and tend to have higher potential returns but bigger ups and downs. Bonds are more like a loan to a company or government and are usually steadier with lower returns. Risk and return generally move together."
  },
  {
    keywords: ["index fund", "mutual fund", "fund"],
    answer:
      "An index fund holds a wide basket of investments designed to track a market index. Because it's diversified, it spreads risk across many companies instead of betting on one. It's a common beginner-friendly concept to learn about."
  },
  {
    keywords: ["credit score", "credit utilization", "utilization"],
    answer:
      "A credit score is a number that reflects how you've handled borrowing. Paying on time and keeping credit utilization low (the share of your available credit you use) are two of the biggest healthy habits."
  },
  {
    keywords: ["emergency fund", "savings", "save"],
    answer:
      "An emergency fund is money set aside for surprise expenses like a car repair. Many people aim to build it up gradually. Even small, consistent amounts help, and it reduces stress when the unexpected happens."
  },
  {
    keywords: ["debit", "credit card", "credit vs"],
    answer:
      "A debit card spends money you already have in your account. A credit card borrows money you pay back later, and can build credit history if used responsibly. The key difference is whose money you're spending right now."
  },
  {
    keywords: ["budget", "budgeting", "how do i budget"],
    answer:
      "Budgeting is simply planning where your money goes, then comparing that plan to what actually happened. Try grouping spending into a few categories, set expected amounts, and review the gaps. The Daisy module walks through this."
  },
  {
    keywords: ["tax", "paycheck", "take-home", "take home"],
    answer:
      "Your paycheck shows gross pay (before deductions) and net or take-home pay (after taxes and benefits). Understanding the difference helps you budget with the money you actually receive."
  },
  {
    keywords: ["lesson", "next", "recommend", "what should i learn", "where to start"],
    answer:
      "A great starting path is: Budgeting Basics (Daisy), then Savings + Emergency Fund (Marigold), then Credit + Debt (Rose). Head to the Learn tab and complete a short lesson to grow that flower."
  },
  {
    keywords: ["weekly challenge", "challenge"],
    answer:
      "This week's challenge is to create your first weekly budget. Completing it gives your garden a growth boost and helps protect your streak. Log expected vs. actual on the Budget tab to finish it."
  }
];

const fallback =
  "I can explain finance concepts in beginner-friendly language and recommend lessons inside the app. Try asking about APR, a Roth IRA, a 401(k) match, budgeting, or stocks vs. bonds. I won't tell you which specific investment to buy or give personalized tax or legal advice.";

export function askSunflower(question: string): string {
  const lower = question.toLowerCase();
  const match = topics.find((topic) => topic.keywords.some((keyword) => lower.includes(keyword)));
  return match ? match.answer : fallback;
}
