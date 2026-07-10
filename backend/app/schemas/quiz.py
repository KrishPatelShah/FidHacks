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


class QuizAttemptRead(BaseModel):
    score: int
    passed: bool
    earned: dict[str, int]
    updated_plant: PlantRead | None = None
    profile: ProfileRead
