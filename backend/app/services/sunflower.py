"""Beginner-friendly financial literacy answerer for the Sunflower companion.

Keyword-matched, scoped to education only (no personalized advice). This mirrors
the on-device answerer so the app behaves the same whether the backend is
reachable or not.
"""

TOPICS: list[tuple[list[str], str]] = [
    (
        ["spent more", "expected", "overspend", "over spend", "actual"],
        "Your actual spending can differ from your plan because real life changes week to week. "
        "Find the category with the biggest gap, ask what changed, then adjust next week's plan. "
        "A good next lesson is Expected vs. Actual Spending.",
    ),
    (
        ["apr", "interest rate"],
        "APR is the yearly cost of borrowing money, shown as a percentage. On a credit card, carrying "
        "a balance means interest is added over time, so purchases can end up costing more than the sticker price.",
    ),
    (
        ["roth", "ira"],
        "A Roth IRA is a retirement account where you contribute money you've already paid taxes on, so "
        "qualified withdrawals in retirement can be tax-free. This is general education, not personal tax advice.",
    ),
    (
        ["401", "employer match", "match"],
        "A 401(k) is a retirement account often offered through work. An employer match means your employer "
        "adds money when you contribute, up to a limit. Many people try to contribute at least enough to get the full match.",
    ),
    (
        ["stock", "bond", "vs bonds", "difference between stocks"],
        "Stocks represent ownership in a company and tend to have higher potential returns but bigger ups and downs. "
        "Bonds are more like a loan to a company or government and are usually steadier with lower returns. "
        "Risk and return generally move together.",
    ),
    (
        ["index fund", "mutual fund", "fund"],
        "An index fund holds a wide basket of investments designed to track a market index. Because it's diversified, "
        "it spreads risk across many companies instead of betting on one. It's a common beginner-friendly concept to learn about.",
    ),
    (
        ["credit score", "credit utilization", "utilization"],
        "A credit score is a number that reflects how you've handled borrowing. Paying on time and keeping credit "
        "utilization low (the share of your available credit you use) are two of the biggest healthy habits.",
    ),
    (
        ["emergency fund", "savings", "save"],
        "An emergency fund is money set aside for surprise expenses like a car repair. Many people aim to build it up "
        "gradually. Even small, consistent amounts help, and it reduces stress when the unexpected happens.",
    ),
    (
        ["debit", "credit card", "credit vs"],
        "A debit card spends money you already have in your account. A credit card borrows money you pay back later, "
        "and can build credit history if used responsibly. The key difference is whose money you're spending right now.",
    ),
    (
        ["budget", "budgeting", "how do i budget"],
        "Budgeting is simply planning where your money goes, then comparing that plan to what actually happened. "
        "Try grouping spending into a few categories, set expected amounts, and review the gaps. The Daisy module walks through this.",
    ),
    (
        ["tax", "paycheck", "take-home", "take home"],
        "Your paycheck shows gross pay (before deductions) and net or take-home pay (after taxes and benefits). "
        "Understanding the difference helps you budget with the money you actually receive.",
    ),
    (
        ["lesson", "next", "recommend", "what should i learn", "where to start"],
        "A great starting path is: Budgeting Basics (Daisy), then Savings + Emergency Fund (Marigold), then "
        "Credit + Debt (Rose). Head to the Learn tab and complete a short lesson to grow that flower.",
    ),
    (
        ["weekly challenge", "challenge"],
        "This week's challenge is to create your first weekly budget. Completing it gives your garden a growth boost "
        "and helps protect your streak. Log expected vs. actual on the Budget tab to finish it.",
    ),
]

FALLBACK = (
    "I can explain finance concepts in beginner-friendly language and recommend lessons inside the app. "
    "Try asking about APR, a Roth IRA, a 401(k) match, budgeting, or stocks vs. bonds. "
    "I won't tell you which specific investment to buy or give personalized tax or legal advice."
)


def answer_question(question: str) -> str:
    lower = question.lower()
    for keywords, answer in TOPICS:
        if any(keyword in lower for keyword in keywords):
            return answer
    return FALLBACK
