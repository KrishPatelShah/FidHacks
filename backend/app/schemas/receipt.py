from pydantic import BaseModel, ConfigDict


class ReceiptScanRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    image_base64: str = ""
    mime_type: str = "image/jpeg"


class ReceiptItem(BaseModel):
    name: str
    price: float
    category: str


class ReceiptScanResponse(BaseModel):
    merchant: str
    date: str
    total: float
    items: list[ReceiptItem]
    source: str  # "gemini" or "fallback"
