from uuid import UUID

from pydantic import BaseModel


class DemoLoginResponse(BaseModel):
    user_id: UUID
    access_token: str
    token_type: str = "demo"
