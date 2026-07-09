from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.plant import Plant
from app.models.user import Profile
from app.schemas.plant import PlantGrowRequest, PlantRead
from app.services.garden_growth import apply_growth

router = APIRouter()


def _plant_read(plant: Plant) -> PlantRead:
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


@router.get("", response_model=list[PlantRead])
def list_plants(
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> list[PlantRead]:
    plants = db.scalars(
        select(Plant).where(Plant.user_id == current_profile.id).order_by(Plant.created_at, Plant.id)
    ).all()
    return [_plant_read(plant) for plant in plants]


@router.post("/{plant_id}/grow", response_model=PlantRead)
def grow_plant(
    plant_id: UUID,
    payload: PlantGrowRequest,
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> PlantRead:
    plant = db.scalar(select(Plant).where(Plant.id == plant_id, Plant.user_id == current_profile.id))
    if plant is None:
        raise HTTPException(status_code=404, detail="Plant not found")
    updated = apply_growth(_plant_read(plant), payload)
    plant.growth = updated.growth
    plant.quantity = updated.quantity
    plant.sunlight = updated.sunlight
    plant.water = updated.water
    plant.fertilizer = updated.fertilizer
    db.commit()
    db.refresh(plant)
    return _plant_read(plant)
