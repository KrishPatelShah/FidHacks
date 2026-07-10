from datetime import date
from uuid import UUID

from pydantic import BaseModel

from app.schemas.lesson import LessonProgressRead
from app.schemas.plant import PlantRead


class ProfileRead(BaseModel):
    id: UUID
    display_name: str
    streak_count: int
    last_activity_date: date | None
    current_path: str
    garden_visibility: str


class ProfileBootstrapRead(BaseModel):
    profile: ProfileRead
    plants: list[PlantRead]
    lesson_progress: list[LessonProgressRead]
    lessons_completed: int
    quizzes_passed: int
