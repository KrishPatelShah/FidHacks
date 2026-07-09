from fastapi import APIRouter

from app.schemas.quiz import QuizAttemptCreate, QuizAttemptRead, QuizQuestionRead

router = APIRouter()

DEMO_QUESTIONS = [
    QuizQuestionRead(
        id="q_budgeting_feedback",
        prompt="What is the main reason to compare expected and actual spending?",
        options=["To feel bad", "To find useful feedback", "To hide spending"],
    )
]
CORRECT_ANSWERS = {"q_budgeting_feedback": 1}


@router.get("/{lesson_id}", response_model=list[QuizQuestionRead])
def get_quiz_questions(lesson_id: str) -> list[QuizQuestionRead]:
    return DEMO_QUESTIONS


@router.post("/{lesson_id}/attempts", response_model=QuizAttemptRead)
def create_quiz_attempt(lesson_id: str, payload: QuizAttemptCreate) -> QuizAttemptRead:
    correct = sum(1 for question_id, answer in payload.answers.items() if CORRECT_ANSWERS.get(question_id) == answer)
    passed = correct == len(CORRECT_ANSWERS)
    return QuizAttemptRead(score=correct, passed=passed, earned={"water": 1} if passed else {})
