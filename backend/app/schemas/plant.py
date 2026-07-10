from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.plant import Plant


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


def plant_read_from_model(plant: Plant) -> PlantRead:
    return PlantRead(
        id=plant.id,
        type=plant.type,
        flower_name=plant.flower_name,
        stage=plant.stage,
        growth=plant.growth,
        quantity=plant.quantity,
        water=plant.water,
        sunlight=plant.sunlight,
        fertilizer=plant.fertilizer,
        unlocked=plant.unlocked,
    )
