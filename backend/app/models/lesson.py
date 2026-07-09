from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class LearningModule(Base):
    __tablename__ = "learning_modules"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    flower_name: Mapped[str] = mapped_column(String(80), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    module_id: Mapped[UUID] = mapped_column(ForeignKey("learning_modules.id", ondelete="CASCADE"), nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False)
    content_type: Mapped[str] = mapped_column(String(40), nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(500))
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    reward: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
