from decimal import Decimal

from fastapi import APIRouter

from app.schemas.budget import BudgetEntryCreate, BudgetEntryRead

router = APIRouter()


@router.get("", response_model=list[BudgetEntryRead])
def list_budget_entries() -> list[BudgetEntryRead]:
    return [
        BudgetEntryRead(
            id="sample_lifestyle",
            category="lifestyle",
            expected_amount=Decimal("150.00"),
            actual_amount=Decimal("225.00"),
            month="2026-07",
            difference=Decimal("75.00"),
        )
    ]


@router.post("", response_model=BudgetEntryRead)
def create_budget_entry(payload: BudgetEntryCreate) -> BudgetEntryRead:
    return BudgetEntryRead(id="new_budget_entry", difference=abs(payload.actual_amount - payload.expected_amount), **payload.model_dump())
