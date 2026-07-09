from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.lesson_lookup import find_lesson_by_slug_or_id
from app.db.session import get_db
from app.models.lesson import LearningModule, Lesson
from app.schemas.lesson import LearningModuleRead, LessonRead

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
    lessons = db.scalars(select(Lesson).order_by(Lesson.title)).all()

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
