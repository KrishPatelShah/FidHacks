from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    streak_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_activity_date: Mapped[date | None] = mapped_column(Date)
    current_path: Mapped[str] = mapped_column(String(40), nullable=False, default="beginner")
    garden_visibility: Mapped[str] = mapped_column(String(40), nullable=False, default="friends")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    budgeting_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    savings_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    credit_debt_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    retirement_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    career_taxes_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    investing_confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    primary_goal: Mapped[str] = mapped_column(String(80), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
