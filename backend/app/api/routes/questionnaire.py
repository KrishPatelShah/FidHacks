from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.user import Profile
from app.models.user import QuestionnaireResponse as QuestionnaireResponseModel
from app.schemas.questionnaire import QuestionnaireCreate, QuestionnaireResponse
from app.services.path_recommendation import recommend_path

router = APIRouter()


@router.post("", response_model=QuestionnaireResponse)
def create_questionnaire_response(
    payload: QuestionnaireCreate,
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> QuestionnaireResponse:
    recommended_path = recommend_path(payload)
    db_response = db.scalar(select(QuestionnaireResponseModel).where(QuestionnaireResponseModel.user_id == current_profile.id))
    if db_response is None:
        db_response = QuestionnaireResponseModel(
            user_id=current_profile.id,
            recommended_path=recommended_path,
            **payload.model_dump(),
        )
        db.add(db_response)
    else:
        for field, value in payload.model_dump().items():
            setattr(db_response, field, value)
        db_response.recommended_path = recommended_path
    current_profile.current_path = recommended_path
    db.commit()
    return QuestionnaireResponse(**payload.model_dump(), recommended_path=recommended_path)
