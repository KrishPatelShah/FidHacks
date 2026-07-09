from fastapi import APIRouter

from app.schemas.community import CommunityPostRead, FriendGardenRead

router = APIRouter()


@router.get("/gardens", response_model=list[FriendGardenRead])
def list_friend_gardens() -> list[FriendGardenRead]:
    return [
        FriendGardenRead(
            user_id="demo_friend_1",
            display_name="Demo Gardener",
            flower_types_unlocked=4,
            milestones_completed=7,
            streak_level="7 day",
        )
    ]


@router.get("/posts", response_model=list[CommunityPostRead])
def list_community_posts() -> list[CommunityPostRead]:
    return [
        CommunityPostRead(
            id="post_1",
            template_type="lesson_completed",
            content="I learned what a Roth IRA is.",
        )
    ]
