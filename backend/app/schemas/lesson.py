from uuid import UUID

from pydantic import BaseModel


class LessonRead(BaseModel):
    id: UUID | str
    category: str
    title: str
    difficulty: str
    content_type: str
    source_url: str | None = None
    summary: str
    reward: dict[str, int]


class LessonProgressRead(BaseModel):
    lesson_id: UUID | str
    completed: bool
    passed: bool


class LearningModuleRead(BaseModel):
    id: UUID | str
    category: str
    flower_name: str
    title: str
    lessons: list[LessonRead] = []
