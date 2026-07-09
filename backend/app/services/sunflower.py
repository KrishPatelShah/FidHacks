def answer_question(question: str) -> str:
    lower = question.lower()

    if "spent more" in lower or "expected" in lower:
        return (
            "Actual spending can differ from planned spending because the week changes. "
            "Review the category with the biggest gap, ask what changed, and adjust the next plan."
        )
    if "apr" in lower:
        return "APR is the yearly cost of borrowing money, shown as a percentage."
    if "roth" in lower:
        return "A Roth IRA is a retirement account type. Qualified withdrawals in retirement can be tax-free."

    return "I can explain beginner finance concepts and recommend lessons. I cannot provide personalized financial advice."
