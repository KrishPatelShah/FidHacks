import { ParsedReceipt } from "@/types/domain";

// Parsed from the demo receipt (Zio Al's Pizza & Pasta). Used when Gemini is
// unavailable so the live demo always produces a real-looking result.
export const fallbackReceipt: ParsedReceipt = {
  merchant: "Zio Al's Pizza & Pasta",
  date: "2025-09-16",
  total: 34.08,
  items: [
    { name: 'Medium 12" Buffalo Chicken Pizza', price: 17.5, category: "wants" },
    { name: 'Small 10" Margherita Pizza', price: 13.99, category: "wants" }
  ]
};
