import { Plant } from "@/types/domain";

const now = "2026-07-09T00:00:00Z";

export const demoPlants: Plant[] = [
  {
    id: "plant_001",
    userId: "demo_user",
    type: "budgeting",
    flowerName: "Daisy",
    stage: 2,
    growth: 68,
    quantity: 3,
    water: 3,
    sunlight: 2,
    fertilizer: 1,
    unlocked: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "plant_002",
    userId: "demo_user",
    type: "savings",
    flowerName: "Marigold",
    stage: 1,
    growth: 34,
    quantity: 1,
    water: 1,
    sunlight: 2,
    fertilizer: 0,
    unlocked: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "plant_003",
    userId: "demo_user",
    type: "credit_debt",
    flowerName: "Rose",
    stage: 1,
    growth: 20,
    quantity: 1,
    water: 1,
    sunlight: 1,
    fertilizer: 0,
    unlocked: true,
    createdAt: now,
    updatedAt: now
  }
];
