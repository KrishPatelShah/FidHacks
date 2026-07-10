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
async def test_questionnaire_response_is_upserted_for_authenticated_user(
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

    updated = {**payload, "budgeting_confidence": 5, "primary_goal": "Build savings"}
    second = await client.post("/api/questionnaire", json=updated, headers=auth_headers)
    assert second.status_code == 200
    assert db_session.scalars(select(QuestionnaireResponse).where(QuestionnaireResponse.user_id == DEMO_USER_ID)).all()[0].primary_goal == "Build savings"
    assert len(db_session.scalars(select(QuestionnaireResponse).where(QuestionnaireResponse.user_id == DEMO_USER_ID)).all()) == 1


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
async def test_profile_bootstrap_returns_authenticated_profile_plants_and_progress(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    response = await client.get("/api/profile", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["profile"]["id"] == str(DEMO_USER_ID)
    assert body["profile"]["display_name"] == "Demo Gardener"
    assert len(body["plants"]) == 5
    flowers_by_type = {plant["type"]: plant["flower_name"] for plant in body["plants"]}
    assert flowers_by_type["retirement"] == "Orchid"
    assert flowers_by_type["funds"] == "Purple Tulip"
    assert body["lesson_progress"] == []
    assert body["lessons_completed"] == 0
    assert body["quizzes_passed"] == 0


@pytest.mark.anyio
async def test_lessons_and_quizzes_are_available_by_slug(client: AsyncClient) -> None:
    modules = await client.get("/api/lessons")
    lesson = await client.get("/api/lessons/budgeting-expected-actual")
    quiz = await client.get("/api/quizzes/budgeting-expected-actual")

    assert modules.status_code == 200
    module_body = modules.json()
    assert module_body[0]["id"] == "module_budgeting"
    assert module_body[0]["lessons"][0]["id"] == "budgeting-expected-actual"
    flowers_by_module = {module["id"]: module["flower_name"] for module in module_body}
    assert flowers_by_module["module_retirement"] == "Orchid"
    assert flowers_by_module["module_investing"] == "Investment Flowers"

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
    plant = db_session.scalar(select(Plant).where(Plant.user_id == DEMO_USER_ID, Plant.type == "budgeting"))
    assert plant is not None
    plant.growth = 90
    before_quantity, before_stage = plant.quantity, plant.stage
    db_session.commit()

    response = await client.post(
        "/api/quizzes/budgeting-expected-actual/attempts",
        json={"answers": {"budgeting-expected-actual-q1": 1, "budgeting-expected-actual-q2": 1}},
        headers=auth_headers,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["score"] == 2
    assert body["passed"] is True
    assert body["question_results"] == [
        {
            "id": "budgeting-expected-actual-q1",
            "correct": True,
            "correct_index": 1,
            "explanation": "The gap between planned and real spending is a learning signal that helps explain what changed.",
        },
        {
            "id": "budgeting-expected-actual-q2",
            "correct": True,
            "correct_index": 1,
            "explanation": "Needs are essential expenses like housing, food, and utilities; wants are discretionary.",
        },
    ]
    assert body["earned"] == {"sunlight": 1, "water": 1}
    assert body["updated_plant"]["growth"] == 0
    assert body["updated_plant"]["quantity"] == before_quantity + 1
    assert body["updated_plant"]["stage"] == before_stage + 1
    assert body["profile"]["id"] == str(DEMO_USER_ID)
    assert body["lessons_completed"] == 1
    assert body["quizzes_passed"] == 1

    attempts = db_session.scalars(select(QuizAttempt).where(QuizAttempt.user_id == DEMO_USER_ID)).all()
    assert len(attempts) == 1
    assert attempts[0].score == 2
    assert attempts[0].passed is True

    repeated = await client.post(
        "/api/quizzes/budgeting-expected-actual/attempts",
        json={"answers": {"budgeting-expected-actual-q1": 1, "budgeting-expected-actual-q2": 1}},
        headers=auth_headers,
    )
    assert repeated.status_code == 200
    assert repeated.json()["earned"] == {}
    assert repeated.json()["updated_plant"] is None
    assert repeated.json()["lessons_completed"] == 1
    assert repeated.json()["quizzes_passed"] == 1


@pytest.mark.anyio
async def test_failed_quiz_records_progress_without_awarding_resources(
    client: AsyncClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    plant = db_session.scalar(select(Plant).where(Plant.user_id == DEMO_USER_ID, Plant.type == "budgeting"))
    assert plant is not None
    before_growth = plant.growth
    response = await client.post(
        "/api/quizzes/budgeting-expected-actual/attempts",
        json={"answers": {"budgeting-expected-actual-q1": 0, "budgeting-expected-actual-q2": 2}},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["passed"] is False
    assert [result["correct"] for result in response.json()["question_results"]] == [False, False]
    assert response.json()["lessons_completed"] == 1
    assert response.json()["quizzes_passed"] == 0
    assert response.json()["earned"] == {}
    assert response.json()["updated_plant"] is None
    db_session.refresh(plant)
    assert plant.growth == before_growth


@pytest.mark.anyio
async def test_lesson_completion_is_persisted_without_awarding_a_reward(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    response = await client.post("/api/lessons/savings-emergency-fund/complete", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == {"lesson_id": "savings-emergency-fund", "completed": True, "passed": False}
    profile = await client.get("/api/profile", headers=auth_headers)
    assert profile.status_code == 200
    assert profile.json()["lesson_progress"] == [{"lesson_id": "savings-emergency-fund", "completed": True, "passed": False}]
