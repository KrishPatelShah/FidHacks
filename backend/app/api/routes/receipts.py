from fastapi import APIRouter

from app.schemas.receipt import ReceiptScanRequest, ReceiptScanResponse
from app.services.receipt import scan_receipt

router = APIRouter()


@router.post("/scan", response_model=ReceiptScanResponse)
def scan(payload: ReceiptScanRequest) -> ReceiptScanResponse:
    result = scan_receipt(payload.image_base64, payload.mime_type)
    return ReceiptScanResponse(**result)
