from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text

from app.core.config import settings


BACKEND_ROOT = Path(__file__).resolve().parents[1]


def test_learning_progress_migration_deduplicates_questionnaire_responses(
    tmp_path: Path, monkeypatch
) -> None:
    database_path = tmp_path / "migration.db"
    database_url = f"sqlite:///{database_path.as_posix()}"
    monkeypatch.setattr(settings, "database_url", database_url)

    config = Config(str(BACKEND_ROOT / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_ROOT / "alembic"))
    command.upgrade(config, "20260709_0001")

    engine = create_engine(database_url)
    user_id = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO profiles
                    (id, display_name, streak_count, current_path, garden_visibility)
                VALUES
                    (:id, 'Migration Test', 0, 'beginner', 'friends')
                """
            ),
            {"id": user_id},
        )
        connection.execute(
            text(
                """
                INSERT INTO questionnaire_responses
                    (id, user_id, budgeting_confidence, savings_confidence,
                     credit_debt_confidence, retirement_confidence,
                     career_taxes_confidence, investing_confidence,
                     primary_goal, recommended_path, created_at)
                VALUES
                    (:id, :user_id, 1, 1, 1, 1, 1, 1, :goal, :path, :created_at)
                """
            ),
            [
                {
                    "id": "11111111111111111111111111111111",
                    "user_id": user_id,
                    "goal": "older",
                    "path": "beginner",
                    "created_at": "2026-01-01 00:00:00",
                },
                {
                    "id": "22222222222222222222222222222222",
                    "user_id": user_id,
                    "goal": "newer",
                    "path": "advanced",
                    "created_at": "2026-02-01 00:00:00",
                },
            ],
        )

    command.upgrade(config, "head")

    with engine.connect() as connection:
        responses = connection.execute(
            text("SELECT primary_goal FROM questionnaire_responses WHERE user_id = :user_id"),
            {"user_id": user_id},
        ).scalars().all()
    engine.dispose()

    assert responses == ["newer"]

