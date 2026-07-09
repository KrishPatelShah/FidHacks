from uuid import UUID

from pydantic import BaseModel


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
    sunlight: int = 0
    water: int = 0
    fertilizer: int = 0
