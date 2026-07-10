import json
import os

import httpx

GEMINI_MODEL = "gemini-1.5-flash"
ALLOWED_CATEGORIES = {"needs", "wants", "save", "income"}

PROMPT = (
    "Extract the receipt data from this image. "
    "Return strict JSON only with merchant, date, total, and items. "
    "Each item should include name, price, and category. "
    "Category must be one of: needs, wants, save, income. "
    "date should be ISO format YYYY-MM-DD if possible. "
    "price and total must be plain numbers (no currency symbols). "
    "Do not include markdown."
)

# Parsed from the demo receipt (Zio Al's Pizza & Pasta). Used when Gemini is
# unavailable so the live demo always produces a real-looking result.
FALLBACK = {
    "merchant": "Zio Al's Pizza & Pasta",
    "date": "2025-09-16",
    "total": 34.08,
    "items": [
        {"name": 'Medium 12" Buffalo Chicken Pizza', "price": 17.5, "category": "wants"},
        {"name": 'Small 10" Margherita Pizza', "price": 13.99, "category": "wants"},
    ],
}


def _normalize(raw: dict) -> dict | None:
    if not isinstance(raw, dict):
        return None
    items_raw = raw.get("items") if isinstance(raw.get("items"), list) else []
    items = []
    for item in items_raw:
        if not isinstance(item, dict):
            continue
        category = str(item.get("category", "")).lower()
        try:
            price = float(item.get("price", 0) or 0)
        except (TypeError, ValueError):
            price = 0.0
        if price <= 0:
            continue
        items.append(
            {
                "name": str(item.get("name", "Item")),
                "price": price,
                "category": category if category in ALLOWED_CATEGORIES else "wants",
            }
        )
    if not items:
        return None
    try:
        total = float(raw.get("total", 0) or 0)
    except (TypeError, ValueError):
        total = 0.0
    return {
        "merchant": str(raw.get("merchant", "Unknown Merchant")),
        "date": str(raw.get("date", "")) or "",
        "total": total or sum(i["price"] for i in items),
        "items": items,
    }


def scan_receipt(image_base64: str, mime_type: str = "image/jpeg") -> dict:
    """Call Gemini vision to parse a receipt. Always returns a valid result;
    falls back to the demo receipt if the key is missing or anything fails."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or not image_base64:
        return {**FALLBACK, "source": "fallback"}

    try:
        response = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent",
            params={"key": api_key},
            json={
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {"text": PROMPT},
                            {"inline_data": {"mime_type": mime_type, "data": image_base64}},
                        ],
                    }
                ],
                "generationConfig": {"responseMimeType": "application/json", "temperature": 0},
            },
            timeout=20.0,
        )
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        cleaned = text.replace("```json", "").replace("```", "").strip()
        parsed = _normalize(json.loads(cleaned))
        if parsed is None:
            return {**FALLBACK, "source": "fallback"}
        return {**parsed, "source": "gemini"}
    except Exception:
        return {**FALLBACK, "source": "fallback"}
