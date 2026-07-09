from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetEntryCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    category: str
    expected_amount: Decimal = Field(ge=0)
    actual_amount: Decimal = Field(ge=0)
    month: str = Field(pattern=r"^\d{4}-\d{2}$")


class BudgetEntryRead(BudgetEntryCreate):
    id: UUID | str
    difference: Decimal
