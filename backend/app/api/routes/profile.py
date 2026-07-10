from fastapi import APIRouter, Depends
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.budget import BudgetEntry
from app.models.lesson import Lesson, LessonProgress
from app.models.plant import Plant
from app.models.quiz import QuizAttempt
from app.models.user import Profile, QuestionnaireResponse
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


@router.post("/reset")
def reset_profile(
    db: Session = Depends(get_db), current_profile: Profile = Depends(get_current_profile)
) -> dict:
    """Wipe the signed-in user's earned progress back to a fresh start.

    Deletes lesson progress, quiz attempts, budget entries, and the
    questionnaire response, zeroes every plant, and resets the profile's streak
    and path. The plant rows themselves (the flower beds) are kept so quizzes
    still have something to grow.
    """
    for model in (LessonProgress, QuizAttempt, BudgetEntry, QuestionnaireResponse):
        db.execute(delete(model).where(model.user_id == current_profile.id))
    for plant in db.scalars(select(Plant).where(Plant.user_id == current_profile.id)).all():
        plant.stage = 0
        plant.growth = 0
        plant.quantity = 0
        plant.water = 0
        plant.sunlight = 0
        plant.fertilizer = 0
        plant.unlocked = False
    current_profile.streak_count = 0
    current_profile.last_activity_date = None
    current_profile.current_path = "beginner"
    db.commit()
    return {"status": "reset"}
