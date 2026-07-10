import { Etf, RiskProfile } from "@/types/domain";

export const etfs: Etf[] = [
  {
    symbol: "VTI",
    name: "Total US Stock Market",
    category: "stocks",
    flowerName: "Red Poppy",
    price: 268.42,
    changePct: 0.84,
    spark: [255, 258, 257, 261, 260, 264, 266, 265, 267, 268],
    riskLabel: "Higher risk",
    fitsProfiles: ["Moderate", "Aggressive"],
    why: "Owns a slice of thousands of US companies in one fund, so a single company's bad day barely moves it.",
    info: "A broad index fund tracking the entire US stock market. Historically higher growth with bigger swings."
  },
  {
    symbol: "VXUS",
    name: "Total International Stock",
    category: "funds",
    flowerName: "Purple Tulip",
    price: 64.11,
    changePct: -0.32,
    spark: [65, 64.6, 64.8, 64.2, 63.9, 64.3, 64.5, 64.2, 64.0, 64.11],
    riskLabel: "Medium risk",
    fitsProfiles: ["Moderate", "Aggressive"],
    why: "Adds companies from outside the US so your garden isn't relying on one country's economy.",
    info: "Tracks international stocks across developed and emerging markets. Adds diversification to a US-heavy mix."
  },
  {
    symbol: "BND",
    name: "Total Bond Market",
    category: "bonds",
    flowerName: "Bluebell",
    price: 72.55,
    changePct: 0.12,
    spark: [72.1, 72.2, 72.3, 72.25, 72.4, 72.35, 72.5, 72.45, 72.5, 72.55],
    riskLabel: "Lower risk",
    fitsProfiles: ["Conservative", "Moderate"],
    why: "Bonds tend to stay calmer than stocks, so they cushion the garden when markets get stormy.",
    info: "A basket of US bonds. Generally steadier than stocks with smaller ups and downs."
  }
];

export const timeRanges = ["1D", "1W", "1M", "3M"] as const;
export type TimeRange = (typeof timeRanges)[number];

export const riskProfileCopy: Record<RiskProfile, string> = {
  Conservative: "You prefer steadier, lower-risk picks. Bonds and cash-like funds fit you well.",
  Moderate: "You're comfortable with a balanced mix of growth and stability.",
  Aggressive: "You're okay with bigger swings for higher long-term growth potential."
};
