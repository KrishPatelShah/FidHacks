from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas.plant import PlantGrowRequest, PlantRead
from app.services.garden_growth import apply_growth

router = APIRouter()

DEMO_PLANTS = [
    PlantRead(
        id=UUID("10000000-0000-0000-0000-000000000001"),
        type="budgeting",
        flower_name="Daisy",
        stage=1,
        growth=45,
        quantity=1,
        water=1,
        sunlight=2,
        fertilizer=0,
        unlocked=True,
    ),
    PlantRead(
        id=UUID("10000000-0000-0000-0000-000000000002"),
        type="credit_debt",
        flower_name="Rose",
        stage=1,
        growth=20,
        quantity=1,
        water=0,
        sunlight=1,
        fertilizer=0,
        unlocked=True,
    ),
]


@router.get("", response_model=list[PlantRead])
def list_plants() -> list[PlantRead]:
    return DEMO_PLANTS


@router.post("/{plant_id}/grow", response_model=PlantRead)
def grow_plant(plant_id: UUID, payload: PlantGrowRequest) -> PlantRead:
    plant = next((item for item in DEMO_PLANTS if item.id == plant_id), None)
    if plant is None:
        raise HTTPException(status_code=404, detail="Plant not found")
    return apply_growth(plant, payload)
