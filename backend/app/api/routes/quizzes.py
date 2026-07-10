from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.api.lesson_lookup import find_lesson_by_slug_or_id
from app.db.session import get_db
from app.models.lesson import LessonProgress
from app.models.plant import Plant
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import Profile
from app.schemas.plant import plant_read_from_model
from app.schemas.profile import ProfileRead
from app.schemas.quiz import QuizAttemptCreate, QuizAttemptRead, QuizQuestionRead, QuizQuestionResultRead
from app.services.garden_growth import apply_reward

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

    question_results = [
        QuizQuestionResultRead(
            id=question.slug,
            correct=payload.answers.get(question.slug) == question.correct_index,
            correct_index=question.correct_index,
            explanation=question.explanation,
        )
        for question in questions
    ]
    correct = sum(result.correct for result in question_results)
    passed = correct == len(questions)
    attempt = QuizAttempt(user_id=current_profile.id, lesson_id=lesson.id, score=correct, passed=passed)
    db.add(attempt)
    progress = db.scalar(
        select(LessonProgress).where(LessonProgress.user_id == current_profile.id, LessonProgress.lesson_id == lesson.id)
    )
    now = datetime.now(timezone.utc)
    if progress is None:
        progress = LessonProgress(user_id=current_profile.id, lesson_id=lesson.id, completed_at=now)
        db.add(progress)
    elif progress.completed_at is None:
        progress.completed_at = now

    updated_plant = None
    first_pass = passed and progress.passed_at is None
    earned = lesson.reward if first_pass else {}
    if first_pass:
        progress.passed_at = now
        plant = db.scalar(select(Plant).where(Plant.user_id == current_profile.id, Plant.type == lesson.category))
        if plant is None:
            raise HTTPException(status_code=409, detail="No garden plant is configured for this lesson category")
        apply_reward(plant, earned)
        updated_plant = plant

    db.commit()
    lessons_completed = db.scalar(
        select(func.count(LessonProgress.id)).where(
            LessonProgress.user_id == current_profile.id,
            LessonProgress.completed_at.is_not(None),
        )
    )
    quizzes_passed = db.scalar(
        select(func.count(LessonProgress.id)).where(
            LessonProgress.user_id == current_profile.id,
            LessonProgress.passed_at.is_not(None),
        )
    )
    return QuizAttemptRead(
        score=correct,
        passed=passed,
        question_results=question_results,
        earned=earned,
        updated_plant=plant_read_from_model(updated_plant) if updated_plant else None,
        profile=ProfileRead(
            id=current_profile.id,
            display_name=current_profile.display_name,
            streak_count=current_profile.streak_count,
            last_activity_date=current_profile.last_activity_date,
            current_path=current_profile.current_path,
            garden_visibility=current_profile.garden_visibility,
        ),
        lessons_completed=lessons_completed or 0,
        quizzes_passed=quizzes_passed or 0,
    )
