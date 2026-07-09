export function askSunflower(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes("spent more") || lower.includes("expected")) {
    return "Your actual spending can differ from your expected plan because real life changes during the week. Look for one category with the biggest gap, ask what changed, then adjust next week's plan. A good next lesson is Expected vs. Actual Spending.";
  }

  if (lower.includes("apr")) {
    return "APR is the yearly cost of borrowing money, shown as a percentage. For credit cards, carrying a balance can make purchases cost more over time.";
  }

  if (lower.includes("roth")) {
    return "A Roth IRA is a retirement account type where qualified withdrawals in retirement can be tax-free. This is education, not personal tax advice.";
  }

  return "I can explain finance concepts in beginner-friendly language and recommend app lessons. I cannot tell you which investment to buy or make personalized tax, legal, or investment decisions.";
}
