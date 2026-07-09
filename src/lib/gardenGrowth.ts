import { Plant } from "@/types/domain";

export type GardenAction = "complete_lesson" | "pass_quiz" | "log_budget" | "complete_weekly_challenge" | "finish_module";

export function applyGardenReward(plant: Plant, action: GardenAction): Plant {
  const reward = {
    complete_lesson: { sunlight: 1, growth: 20 },
    pass_quiz: { water: 1, growth: 40 },
    log_budget: { fertilizer: 1, growth: 25 },
    complete_weekly_challenge: { sunlight: 1, water: 1, fertilizer: 1, growth: 45 },
    finish_module: { growth: 100 }
  }[action];

  const nextGrowth = Math.min(100, plant.growth + reward.growth);
  const earnedFlower = nextGrowth >= 100;

  return {
    ...plant,
    sunlight: plant.sunlight + (reward.sunlight ?? 0),
    water: plant.water + (reward.water ?? 0),
    fertilizer: plant.fertilizer + (reward.fertilizer ?? 0),
    growth: earnedFlower ? 0 : nextGrowth,
    quantity: earnedFlower ? plant.quantity + 1 : plant.quantity,
    stage: earnedFlower ? plant.stage + 1 : plant.stage,
    updatedAt: new Date().toISOString()
  };
}
