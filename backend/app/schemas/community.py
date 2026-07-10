from uuid import UUID

from pydantic import BaseModel


class FriendGardenRead(BaseModel):
    user_id: UUID | str
    display_name: str
    flower_types_unlocked: int
    milestones_completed: int
    streak_level: str


class CommunityPostRead(BaseModel):
    id: UUID | str
    template_type: str
    content: str
