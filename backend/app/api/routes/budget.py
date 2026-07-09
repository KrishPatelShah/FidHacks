from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_profile
from app.db.session import get_db
from app.models.budget import BudgetEntry
from app.models.user import Profile
from app.schemas.budget import BudgetEntryCreate, BudgetEntryRead

router = APIRouter()


def _budget_entry_read(entry: BudgetEntry) -> BudgetEntryRead:
    return BudgetEntryRead(
        id=entry.id,
        category=entry.category,
        expected_amount=entry.expected_amount,
        actual_amount=entry.actual_amount,
        month=entry.month,
        difference=abs(entry.actual_amount - entry.expected_amount),
    )


@router.get("", response_model=list[BudgetEntryRead])
def list_budget_entries(
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> list[BudgetEntryRead]:
    entries = db.scalars(
        select(BudgetEntry)
        .where(BudgetEntry.user_id == current_profile.id)
        .order_by(BudgetEntry.month.desc(), BudgetEntry.created_at.desc(), BudgetEntry.id)
    ).all()
    return [_budget_entry_read(entry) for entry in entries]


@router.post("", response_model=BudgetEntryRead)
def create_budget_entry(
    payload: BudgetEntryCreate,
    db: Session = Depends(get_db),
    current_profile: Profile = Depends(get_current_profile),
) -> BudgetEntryRead:
    entry = BudgetEntry(user_id=current_profile.id, **payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return _budget_entry_read(entry)
