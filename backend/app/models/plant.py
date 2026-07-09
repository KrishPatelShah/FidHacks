from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[str] = mapped_column(String(60), nullable=False)
    flower_name: Mapped[str] = mapped_column(String(80), nullable=False)
    stage: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    growth: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    water: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sunlight: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fertilizer: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    unlocked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
