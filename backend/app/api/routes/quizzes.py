from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.api.lesson_lookup import find_lesson_by_slug_or_id
from app.db.session import get_db
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import Profile
from app.schemas.quiz import QuizAttemptCreate, QuizAttemptRead, QuizQuestionRead

router = APIRouter()


@router.get("/{lesson_id}", response_model=list[QuizQuestionRead])
def get_quiz_questions(lesson_id: str, db: Session = Depends(get_db)) -> list[QuizQuestionRead]:
    lesson = find_lesson_by_slug_or_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    questions = db.scalars(select(QuizQuestion).where(QuizQuestion.lesson_id == lesson.id).order_by(QuizQuestion.slug)).all()
    return [QuizQuestionRead(id=question.slug, prompt=question.prompt, options=question.options) for question in questions]


@router.post("/{lesson_id}/attempts", response_model=QuizAttemptRead)
def create_quiz_attempt(
    lesson_id: str,
    payload: QuizAttemptCreate,
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> QuizAttemptRead:
    lesson = find_lesson_by_slug_or_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    questions = db.scalars(select(QuizQuestion).where(QuizQuestion.lesson_id == lesson.id).order_by(QuizQuestion.slug)).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Quiz not found")

    correct = sum(1 for question in questions if payload.answers.get(question.slug) == question.correct_index)
    passed = correct == len(questions)
    attempt = QuizAttempt(user_id=current_profile.id, lesson_id=lesson.id, score=correct, passed=passed)
    db.add(attempt)
    db.commit()
    return QuizAttemptRead(score=correct, passed=passed, earned=lesson.reward if passed else {})
