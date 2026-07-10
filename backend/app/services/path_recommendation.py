from app.schemas.questionnaire import QuestionnaireCreate


def recommend_path(response: QuestionnaireCreate) -> str:
    scores = [
        response.budgeting_confidence,
        response.savings_confidence,
        response.credit_debt_confidence,
        response.retirement_confidence,
        response.career_taxes_confidence,
        response.investing_confidence,
    ]
    average = sum(scores) / len(scores)

    if average <= 2.25:
        return "beginner"
    if average <= 3.75:
        return "intermediate"
    return "advanced"
