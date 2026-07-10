from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.plant import PlantRead
from app.schemas.profile import ProfileRead


class QuizQuestionRead(BaseModel):
    id: UUID | str
    prompt: str
    options: list[str]


class QuizAttemptCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    answers: dict[str, int]


class QuizQuestionResultRead(BaseModel):
    id: str
    correct: bool
    correct_index: int
    explanation: str


class QuizAttemptRead(BaseModel):
    score: int
    passed: bool
    question_results: list[QuizQuestionResultRead]
    earned: dict[str, int]
    updated_plant: PlantRead | None = None
    profile: ProfileRead
    lessons_completed: int
    quizzes_passed: int
