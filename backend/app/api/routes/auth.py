from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DEMO_USER_ID, upsert_demo_profile
from app.db.session import get_db
from app.schemas.auth import DemoLoginResponse

router = APIRouter()


@router.post("/demo", response_model=DemoLoginResponse)
def demo_login(db: Session = Depends(get_db)) -> DemoLoginResponse:
    upsert_demo_profile(db)
    return DemoLoginResponse(user_id=DEMO_USER_ID, access_token=f"demo:{DEMO_USER_ID}")
