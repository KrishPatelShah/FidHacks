from pydantic import BaseModel


class SunflowerAskRequest(BaseModel):
    question: str


class SunflowerAskResponse(BaseModel):
    answer: str
