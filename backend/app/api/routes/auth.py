from uuid import UUID

from fastapi import APIRouter

from app.schemas.auth import DemoLoginResponse

router = APIRouter()

DEMO_USER_ID = UUID("00000000-0000-0000-0000-000000000001")


@router.post("/demo", response_model=DemoLoginResponse)
def demo_login() -> DemoLoginResponse:
    return DemoLoginResponse(user_id=DEMO_USER_ID, access_token=f"demo:{DEMO_USER_ID}")
