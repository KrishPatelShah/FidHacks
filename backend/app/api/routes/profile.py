from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.lesson import Lesson, LessonProgress
from app.models.plant import Plant
from app.models.user import Profile
from app.schemas.lesson import LessonProgressRead
from app.schemas.plant import plant_read_from_model
from app.schemas.profile import ProfileBootstrapRead

router = APIRouter()


def profile_read_from_model(profile: Profile) -> dict:
    return {
        "id": profile.id,
        "display_name": profile.display_name,
        "streak_count": profile.streak_count,
        "last_activity_date": profile.last_activity_date,
        "current_path": profile.current_path,
        "garden_visibility": profile.garden_visibility,
    }


@router.get("", response_model=ProfileBootstrapRead)
def get_profile_bootstrap(
    db: Session = Depends(get_db), current_profile: Profile = Depends(get_current_profile)
) -> ProfileBootstrapRead:
    plants = db.scalars(select(Plant).where(Plant.user_id == current_profile.id).order_by(Plant.created_at, Plant.id)).all()
    progress_rows = db.execute(
        select(LessonProgress, Lesson.slug)
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .where(LessonProgress.user_id == current_profile.id)
        .order_by(LessonProgress.created_at)
    ).all()
    return ProfileBootstrapRead(
        profile=profile_read_from_model(current_profile),
        plants=[plant_read_from_model(plant) for plant in plants],
        lesson_progress=[
            LessonProgressRead(lesson_id=slug, completed=item.completed_at is not None, passed=item.passed_at is not None)
            for item, slug in progress_rows
        ],
        lessons_completed=sum(item.completed_at is not None for item, _ in progress_rows),
        quizzes_passed=sum(item.passed_at is not None for item, _ in progress_rows),
    )
