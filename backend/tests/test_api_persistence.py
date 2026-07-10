from decimal import Decimal
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import DEMO_USER_ID
from app.models.budget import BudgetEntry
from app.models.plant import Plant
from app.models.quiz import QuizAttempt
from app.models.user import Profile, QuestionnaireResponse


@pytest.fixture
async def client(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as test_client:
        yield test_client


@pytest.mark.anyio
async def test_demo_auth_returns_token_for_seeded_demo_profile(client: AsyncClient, db_session: Session) -> None:
    response = await client.post("/api/auth/demo")

    assert response.status_code == 200
    body = response.json()
    assert body == {
        "user_id": str(DEMO_USER_ID),
        "access_token": f"demo:{DEMO_USER_ID}",
        "token_type": "demo",
    }
    assert db_session.get(Profile, DEMO_USER_ID).display_name == "Demo Gardener"


@pytest.mark.anyio
async def test_protected_routes_reject_missing_and_invalid_bearer_tokens(client: AsyncClient) -> None:
    missing = await client.get("/api/budget")
    invalid = await client.get("/api/budget", headers={"Authorization": "Bearer not-a-demo-token"})

    assert missing.status_code == 401
    assert missing.json()["detail"] == "Missing bearer token"
    assert invalid.status_code == 401
    assert invalid.json()["detail"] == "Invalid bearer token"


@pytest.mark.anyio
async def test_questionnaire_response_is_persisted_for_authenticated_user(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    payload = {
        "budgeting_confidence": 1,
        "savings_confidence": 4,
        "credit_debt_confidence": 5,
        "retirement_confidence": 5,
        "career_taxes_confidence": 5,
        "investing_confidence": 5,
        "primary_goal": "Build a budget habit",
    }

    response = await client.post("/api/questionnaire", json=payload, headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert body == {**payload, "recommended_path": "advanced"}

    saved = db_session.scalar(select(QuestionnaireResponse).where(QuestionnaireResponse.user_id == DEMO_USER_ID))
    assert saved is not None
    assert saved.primary_goal == payload["primary_goal"]
    assert saved.recommended_path == "advanced"
    assert db_session.get(Profile, DEMO_USER_ID).current_path == "advanced"


@pytest.mark.anyio
async def test_budget_entries_persist_and_reject_client_supplied_user_id(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    payload = {
        "category": "Groceries",
        "expected_amount": "250.00",
        "actual_amount": "237.50",
        "month": "2026-07",
    }

    created = await client.post("/api/budget", json=payload, headers=auth_headers)
    rejected = await client.post(
        "/api/budget",
        json={**payload, "user_id": "11111111-1111-1111-1111-111111111111"},
        headers=auth_headers,
    )
    listed = await client.get("/api/budget", headers=auth_headers)

    assert created.status_code == 200
    created_body = created.json()
    assert created_body["category"] == "Groceries"
    assert created_body["difference"] == "12.50"
    assert rejected.status_code == 422
    assert listed.status_code == 200
    assert listed.json() == [created_body]

    entries = db_session.scalars(select(BudgetEntry).where(BudgetEntry.user_id == DEMO_USER_ID)).all()
    assert len(entries) == 1
    assert entries[0].expected_amount == Decimal("250.00")


@pytest.mark.anyio
async def test_plant_list_and_grow_changes_are_persisted(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    before = await client.get("/api/plants", headers=auth_headers)
    assert before.status_code == 200
    plant_before = before.json()[0]

    grown = await client.post(
        f"/api/plants/{plant_before['id']}/grow",
        json={"sunlight": 1, "water": 2, "fertilizer": 1},
        headers=auth_headers,
    )
    after = await client.get("/api/plants", headers=auth_headers)

    assert grown.status_code == 200
    grown_body = grown.json()
    assert grown_body["growth"] == min(100, plant_before["growth"] + 45)
    assert grown_body["sunlight"] == plant_before["sunlight"] + 1
    assert grown_body["water"] == plant_before["water"] + 2
    assert grown_body["fertilizer"] == plant_before["fertilizer"] + 1
    assert after.json()[0] == grown_body

    saved = db_session.get(Plant, UUID(plant_before["id"]))
    assert saved.growth == grown_body["growth"]
    assert saved.water == grown_body["water"]


@pytest.mark.anyio
async def test_lessons_and_quizzes_are_available_by_slug(client: AsyncClient) -> None:
    modules = await client.get("/api/lessons")
    lesson = await client.get("/api/lessons/budgeting-expected-actual")
    quiz = await client.get("/api/quizzes/budgeting-expected-actual")

    assert modules.status_code == 200
    assert modules.json()[0]["id"] == "module_budgeting"
    assert modules.json()[0]["lessons"][0]["id"] == "budgeting-expected-actual"

    assert lesson.status_code == 200
    assert lesson.json()["id"] == "budgeting-expected-actual"
    assert lesson.json()["reward"] == {"sunlight": 1, "water": 1}

    assert quiz.status_code == 200
    quiz_body = quiz.json()
    assert [question["id"] for question in quiz_body] == [
        "budgeting-expected-actual-q1",
        "budgeting-expected-actual-q2",
    ]
    assert "correct_index" not in quiz_body[0]


@pytest.mark.anyio
async def test_quiz_attempt_is_scored_and_persisted(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    response = await client.post(
        "/api/quizzes/budgeting-expected-actual/attempts",
        json={"answers": {"budgeting-expected-actual-q1": 1, "budgeting-expected-actual-q2": 0}},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json() == {"score": 2, "passed": True, "earned": {"sunlight": 1, "water": 1}}

    attempts = db_session.scalars(select(QuizAttempt).where(QuizAttempt.user_id == DEMO_USER_ID)).all()
    assert len(attempts) == 1
    assert attempts[0].score == 2
    assert attempts[0].passed is True
