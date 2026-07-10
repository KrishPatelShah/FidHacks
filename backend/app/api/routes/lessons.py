from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.api.lesson_lookup import find_lesson_by_slug_or_id
from app.db.session import get_db
from app.models.lesson import LearningModule, Lesson, LessonProgress
from app.models.user import Profile
from app.schemas.lesson import LearningModuleRead, LessonProgressRead, LessonRead

router = APIRouter()


def _lesson_read(lesson: Lesson) -> LessonRead:
    return LessonRead(
        id=lesson.slug,
        category=lesson.category,
        title=lesson.title,
        difficulty=lesson.difficulty,
        content_type=lesson.content_type,
        source_url=lesson.source_url,
        summary=lesson.summary,
        reward=lesson.reward,
    )


@router.get("", response_model=list[LearningModuleRead])
def list_learning_modules(db: Session = Depends(get_db)) -> list[LearningModuleRead]:
    modules = db.scalars(select(LearningModule).order_by(LearningModule.sort_order, LearningModule.title)).all()
    lessons = db.scalars(select(Lesson).order_by(Lesson.sort_order, Lesson.title)).all()

    lessons_by_module: dict[UUID, list[LessonRead]] = {}
    for lesson in lessons:
        lessons_by_module.setdefault(lesson.module_id, []).append(_lesson_read(lesson))

    return [
        LearningModuleRead(
            id=module.slug,
            category=module.category,
            flower_name=module.flower_name,
            title=module.title,
            lessons=lessons_by_module.get(module.id, []),
        )
        for module in modules
    ]


@router.get("/{lesson_id}", response_model=LessonRead)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)) -> LessonRead:
    lesson = find_lesson_by_slug_or_id(db, lesson_id)
    if lesson is not None:
        return _lesson_read(lesson)
    raise HTTPException(status_code=404, detail="Lesson not found")


@router.post("/{lesson_id}/complete", response_model=LessonProgressRead)
def complete_lesson(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> LessonProgressRead:
    lesson = find_lesson_by_slug_or_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    progress = db.scalar(
        select(LessonProgress).where(LessonProgress.user_id == current_profile.id, LessonProgress.lesson_id == lesson.id)
    )
    if progress is None:
        progress = LessonProgress(user_id=current_profile.id, lesson_id=lesson.id, completed_at=datetime.now(timezone.utc))
        db.add(progress)
    elif progress.completed_at is None:
        progress.completed_at = datetime.now(timezone.utc)
    db.commit()
    return LessonProgressRead(lesson_id=lesson.slug, completed=True, passed=progress.passed_at is not None)
