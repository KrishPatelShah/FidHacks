"""initial backend tables

Revision ID: 20260709_0001
Revises:
Create Date: 2026-07-09
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260709_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=False),
        sa.Column("streak_count", sa.Integer(), nullable=False),
        sa.Column("last_activity_date", sa.Date(), nullable=True),
        sa.Column("current_path", sa.String(length=40), nullable=False),
        sa.Column("garden_visibility", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "learning_modules",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("flower_name", sa.String(length=80), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_learning_modules_slug"), "learning_modules", ["slug"], unique=False)
    op.create_table(
        "budget_entries",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("expected_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("actual_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("month", sa.String(length=7), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "community_posts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("template_type", sa.String(length=80), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "lessons",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("module_id", sa.Uuid(), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("difficulty", sa.String(length=40), nullable=False),
        sa.Column("content_type", sa.String(length=40), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=True),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("reward", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["module_id"], ["learning_modules.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_lessons_slug"), "lessons", ["slug"], unique=False)
    op.create_table(
        "plants",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("type", sa.String(length=60), nullable=False),
        sa.Column("flower_name", sa.String(length=80), nullable=False),
        sa.Column("stage", sa.Integer(), nullable=False),
        sa.Column("growth", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("water", sa.Integer(), nullable=False),
        sa.Column("sunlight", sa.Integer(), nullable=False),
        sa.Column("fertilizer", sa.Integer(), nullable=False),
        sa.Column("unlocked", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "questionnaire_responses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("budgeting_confidence", sa.Integer(), nullable=False),
        sa.Column("savings_confidence", sa.Integer(), nullable=False),
        sa.Column("credit_debt_confidence", sa.Integer(), nullable=False),
        sa.Column("retirement_confidence", sa.Integer(), nullable=False),
        sa.Column("career_taxes_confidence", sa.Integer(), nullable=False),
        sa.Column("investing_confidence", sa.Integer(), nullable=False),
        sa.Column("primary_goal", sa.String(length=80), nullable=False),
        sa.Column("recommended_path", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "quiz_questions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("options", sa.JSON(), nullable=False),
        sa.Column("correct_index", sa.Integer(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_quiz_questions_slug"), "quiz_questions", ["slug"], unique=False)
    op.create_table(
        "quiz_attempts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("passed", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("quiz_attempts")
    op.drop_index(op.f("ix_quiz_questions_slug"), table_name="quiz_questions")
    op.drop_table("quiz_questions")
    op.drop_table("questionnaire_responses")
    op.drop_table("plants")
    op.drop_index(op.f("ix_lessons_slug"), table_name="lessons")
    op.drop_table("lessons")
    op.drop_table("community_posts")
    op.drop_table("budget_entries")
    op.drop_index(op.f("ix_learning_modules_slug"), table_name="learning_modules")
    op.drop_table("learning_modules")
    op.drop_table("profiles")
