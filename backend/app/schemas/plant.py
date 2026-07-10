from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PlantRead(BaseModel):
    id: UUID
    type: str
    flower_name: str
    stage: int
    growth: int
    quantity: int
    water: int
    sunlight: int
    fertilizer: int
    unlocked: bool


class PlantGrowRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sunlight: int = Field(default=0, ge=0)
    water: int = Field(default=0, ge=0)
    fertilizer: int = Field(default=0, ge=0)
