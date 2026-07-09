from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class BudgetEntryCreate(BaseModel):
    category: str
    expected_amount: Decimal
    actual_amount: Decimal
    month: str


class BudgetEntryRead(BudgetEntryCreate):
    id: UUID | str
    difference: Decimal
