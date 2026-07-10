from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.plant import Plant
from app.models.user import Profile
from app.schemas.plant import PlantRead, plant_read_from_model

router = APIRouter()


def _plant_read(plant: Plant) -> PlantRead:
    return plant_read_from_model(plant)


@router.get("", response_model=list[PlantRead])
def list_plants(
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> list[PlantRead]:
    plants = db.scalars(
        select(Plant).where(Plant.user_id == current_profile.id).order_by(Plant.created_at, Plant.id)
    ).all()
    return [_plant_read(plant) for plant in plants]
