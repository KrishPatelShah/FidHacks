from fastapi import APIRouter

from app.schemas.sunflower import SunflowerAskRequest, SunflowerAskResponse
from app.services.sunflower import answer_question

router = APIRouter()


@router.post("/ask", response_model=SunflowerAskResponse)
def ask_sunflower(payload: SunflowerAskRequest) -> SunflowerAskResponse:
    return SunflowerAskResponse(answer=answer_question(payload.question))
