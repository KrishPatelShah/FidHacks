from fastapi import APIRouter

from app.schemas.questionnaire import QuestionnaireCreate, QuestionnaireResponse
from app.services.path_recommendation import recommend_path

router = APIRouter()


@router.post("", response_model=QuestionnaireResponse)
def create_questionnaire_response(payload: QuestionnaireCreate) -> QuestionnaireResponse:
    return QuestionnaireResponse(**payload.model_dump(), recommended_path=recommend_path(payload))
