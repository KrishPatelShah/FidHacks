from uuid import UUID

from pydantic import BaseModel


class QuizQuestionRead(BaseModel):
    id: UUID | str
    prompt: str
    options: list[str]


class QuizAttemptCreate(BaseModel):
    answers: dict[str, int]


class QuizAttemptRead(BaseModel):
    score: int
    passed: bool
    earned: dict[str, int]
