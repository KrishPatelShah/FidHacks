from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import Profile


DEMO_USER_ID = UUID("00000000-0000-0000-0000-000000000001")
DEMO_TOKEN_PREFIX = "demo:"

bearer_scheme = HTTPBearer(auto_error=False)


def upsert_demo_profile(db: Session) -> Profile:
    profile = db.get(Profile, DEMO_USER_ID)
    if profile is None:
        profile = Profile(
            id=DEMO_USER_ID,
            display_name="Demo Gardener",
            current_path="beginner",
            garden_visibility="friends",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def get_current_profile(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Profile:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    token = credentials.credentials
    if not token.startswith(DEMO_TOKEN_PREFIX):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token")

    raw_user_id = token.removeprefix(DEMO_TOKEN_PREFIX)
    try:
        user_id = UUID(raw_user_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token") from exc

    profile = db.get(Profile, user_id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not found")
    return profile
