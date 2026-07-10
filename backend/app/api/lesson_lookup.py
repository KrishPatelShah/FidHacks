from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.lesson import Lesson


def find_lesson_by_slug_or_id(db: Session, lesson_id: str) -> Lesson | None:
    try:
        uuid_id = UUID(lesson_id)
    except ValueError:
        uuid_id = None

    filters = [Lesson.slug == lesson_id]
    if uuid_id is not None:
        filters.append(Lesson.id == uuid_id)

    return db.scalar(select(Lesson).where(or_(*filters)))
