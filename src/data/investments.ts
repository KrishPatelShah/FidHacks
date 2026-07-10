import { InvestTopic, RiskProfile } from "@/types/domain";

// Investment ideas are grouped into themed topics, each with its top 5 names,
// so the app teaches a diversified basket instead of pushing one stock. Every
// stock carries static mock price/spark values used as a fallback whenever live
// market data is missing (no API key, rate limit, or offline).
export const topics: InvestTopic[] = [
  {
    id: "big-tech",
    title: "Big Tech Titans",
    theme: "The largest US technology companies",
    category: "stocks",
    flowerName: "Red Poppy",
    riskLabel: "Higher risk",
    fitsProfiles: ["Moderate", "Aggressive"],
    why: "Instead of betting on one company, this theme spreads across the five biggest tech names, so one stumble doesn't sink the whole idea.",
    info: "Mega-cap technology leaders. Historically strong growth, but they move in bigger swings and can fall together in a tech sell-off.",
    stocks: [
      { symbol: "AAPL", name: "Apple", price: 229.35, changePct: 0.74, spark: [221, 223, 222, 225, 227, 226, 228, 229, 228, 229.35] },
      { symbol: "MSFT", name: "Microsoft", price: 447.12, changePct: 0.52, spark: [438, 440, 441, 443, 442, 445, 446, 447, 446, 447.12] },
      { symbol: "GOOGL", name: "Alphabet", price: 178.9, changePct: -0.31, spark: [180, 179, 180, 178, 179, 178, 177, 178, 179, 178.9] },
      { symbol: "AMZN", name: "Amazon", price: 201.44, changePct: 1.12, spark: [195, 197, 196, 198, 199, 200, 199, 201, 200, 201.44] },
      { symbol: "NVDA", name: "Nvidia", price: 128.7, changePct: 1.84, spark: [120, 122, 123, 124, 126, 125, 127, 128, 127, 128.7] }
    ]
  },
  {
    id: "everyday-essentials",
    title: "Everyday Essentials",
    theme: "Consumer staples people buy in any economy",
    category: "stocks",
    flowerName: "Red Poppy",
    riskLabel: "Medium risk",
    fitsProfiles: ["Conservative", "Moderate", "Aggressive"],
    why: "These companies sell things people buy no matter what the economy does, so as a group they tend to be steadier than high-flying tech.",
    info: "Household names in food, drinks, and retail. Slower growth than tech, but historically calmer during downturns.",
    stocks: [
      { symbol: "KO", name: "Coca-Cola", price: 63.28, changePct: 0.21, spark: [62.4, 62.6, 62.5, 62.8, 63.0, 62.9, 63.1, 63.2, 63.1, 63.28] },
      { symbol: "PG", name: "Procter & Gamble", price: 168.44, changePct: -0.14, spark: [169, 168.5, 168.8, 168.2, 168.6, 168.3, 168.1, 168.5, 168.4, 168.44] },
      { symbol: "WMT", name: "Walmart", price: 82.11, changePct: 0.63, spark: [80.5, 80.9, 81.2, 81.0, 81.5, 81.8, 81.6, 82.0, 81.9, 82.11] },
      { symbol: "COST", name: "Costco", price: 905.3, changePct: 0.42, spark: [892, 896, 898, 900, 899, 902, 904, 903, 905, 905.3] },
      { symbol: "PEP", name: "PepsiCo", price: 148.72, changePct: -0.22, spark: [150, 149.5, 149.8, 149.2, 149.0, 148.9, 149.1, 148.8, 148.9, 148.72] }
    ]
  },
  {
    id: "broad-index",
    title: "Broad Index Funds",
    theme: "One-click diversification across the market",
    category: "funds",
    flowerName: "Purple Tulip",
    riskLabel: "Medium risk",
    fitsProfiles: ["Moderate", "Aggressive"],
    why: "Each of these funds already holds hundreds or thousands of companies, so the whole basket is diversification stacked on diversification.",
    info: "Low-cost index and ETF funds tracking large slices of the market. A common core holding for long-term investors.",
    stocks: [
      { symbol: "VTI", name: "Total US Stock Market", price: 268.42, changePct: 0.84, spark: [255, 258, 257, 261, 260, 264, 266, 265, 267, 268.42] },
      { symbol: "VOO", name: "S&P 500 ETF", price: 545.6, changePct: 0.72, spark: [532, 536, 535, 539, 540, 542, 544, 543, 545, 545.6] },
      { symbol: "VXUS", name: "Total International Stock", price: 64.11, changePct: -0.32, spark: [65, 64.6, 64.8, 64.2, 63.9, 64.3, 64.5, 64.2, 64.0, 64.11] },
      { symbol: "QQQ", name: "Nasdaq-100 ETF", price: 495.18, changePct: 1.05, spark: [480, 484, 483, 487, 489, 491, 493, 492, 494, 495.18] },
      { symbol: "SCHD", name: "US Dividend Equity", price: 27.64, changePct: 0.19, spark: [27.2, 27.3, 27.25, 27.4, 27.5, 27.45, 27.55, 27.6, 27.58, 27.64] }
    ]
  },
  {
    id: "steady-bonds",
    title: "Steady Bond Funds",
    theme: "Lower-risk ballast for calmer growth",
    category: "bonds",
    flowerName: "Bluebell",
    riskLabel: "Lower risk",
    fitsProfiles: ["Conservative", "Moderate"],
    why: "Bonds tend to stay calmer than stocks. Holding a few different bond funds cushions the garden when the stock market gets stormy.",
    info: "A mix of government and corporate bond funds. Generally steadier than stocks, with smaller ups and downs.",
    stocks: [
      { symbol: "BND", name: "Total Bond Market", price: 72.55, changePct: 0.12, spark: [72.1, 72.2, 72.3, 72.25, 72.4, 72.35, 72.5, 72.45, 72.5, 72.55] },
      { symbol: "AGG", name: "US Aggregate Bond", price: 98.34, changePct: 0.09, spark: [98.0, 98.1, 98.15, 98.2, 98.18, 98.25, 98.3, 98.28, 98.32, 98.34] },
      { symbol: "TLT", name: "20+ Year Treasury", price: 92.18, changePct: -0.24, spark: [93, 92.8, 92.6, 92.7, 92.4, 92.5, 92.3, 92.2, 92.1, 92.18] },
      { symbol: "LQD", name: "Investment Grade Corp", price: 108.46, changePct: 0.15, spark: [108, 108.1, 108.2, 108.15, 108.3, 108.25, 108.4, 108.35, 108.42, 108.46] },
      { symbol: "VCIT", name: "Intermediate Corp Bond", price: 80.92, changePct: 0.07, spark: [80.6, 80.65, 80.7, 80.72, 80.75, 80.8, 80.85, 80.82, 80.9, 80.92] }
    ]
  }
];

export const timeRanges = ["1D", "1W", "1M", "3M"] as const;
export type TimeRange = (typeof timeRanges)[number];

export const riskProfileCopy: Record<RiskProfile, string> = {
  Conservative: "You prefer steadier, lower-risk picks. Bonds and cash-like funds fit you well.",
  Moderate: "You're comfortable with a balanced mix of growth and stability.",
  Aggressive: "You're okay with bigger swings for higher long-term growth potential."
};
