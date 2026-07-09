from pydantic import BaseModel, Field


class QuestionnaireCreate(BaseModel):
    budgeting_confidence: int = Field(ge=1, le=5)
    savings_confidence: int = Field(ge=1, le=5)
    credit_debt_confidence: int = Field(ge=1, le=5)
    retirement_confidence: int = Field(ge=1, le=5)
    career_taxes_confidence: int = Field(ge=1, le=5)
    investing_confidence: int = Field(ge=1, le=5)
    primary_goal: str


class QuestionnaireResponse(QuestionnaireCreate):
    recommended_path: str
