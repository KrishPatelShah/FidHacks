import { SpendCategory, Transaction } from "@/types/domain";

export const spendCategoryLabels: Record<SpendCategory, string> = {
  needs: "Needs",
  wants: "Wants",
  save: "Save",
  income: "Income"
};

export const sampleTransactions: Transaction[] = [
  { id: "txn_1", merchant: "Trader Joe's", amount: 62.4, category: "needs", source: "scanned", date: "2026-07-09T14:12:00Z", note: "Groceries" },
  { id: "txn_2", merchant: "Spotify", amount: 11.99, category: "wants", source: "manual", date: "2026-07-08T09:00:00Z", note: "Subscription" },
  { id: "txn_3", merchant: "Paycheck", amount: 1450, category: "income", source: "manual", date: "2026-07-08T08:00:00Z", note: "Biweekly deposit" },
  { id: "txn_4", merchant: "Vanguard Transfer", amount: 200, category: "save", source: "manual", date: "2026-07-07T18:30:00Z", note: "Auto-invest" },
  { id: "txn_5", merchant: "Chipotle", amount: 13.85, category: "wants", source: "scanned", date: "2026-07-07T12:45:00Z", note: "Lunch" },
  { id: "txn_6", merchant: "PG&E", amount: 84.2, category: "needs", source: "scanned", date: "2026-07-06T16:00:00Z", note: "Utilities" },
  { id: "txn_7", merchant: "Emergency Fund", amount: 100, category: "save", source: "manual", date: "2026-07-05T10:00:00Z", note: "Weekly transfer" }
];

// Mock receipts the "scanner" can produce so the demo feels real without a camera.
export const mockReceipts: Array<Pick<Transaction, "merchant" | "amount" | "category" | "note">> = [
  { merchant: "Whole Foods", amount: 47.31, category: "needs", note: "Groceries" },
  { merchant: "Shell Gas", amount: 39.8, category: "needs", note: "Fuel" },
  { merchant: "Starbucks", amount: 6.75, category: "wants", note: "Coffee" },
  { merchant: "AMC Theatres", amount: 21.5, category: "wants", note: "Movie night" },
  { merchant: "CVS Pharmacy", amount: 18.42, category: "needs", note: "Pharmacy" }
];
