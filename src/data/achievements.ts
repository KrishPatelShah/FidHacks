import { Achievement } from "@/types/domain";

export const achievementDefs: Achievement[] = [
  { id: "first_sprout", title: "First Sprout", description: "Grow your very first flower from a habit.", icon: "leaf", metric: "flowersGrown", goal: 1 },
  { id: "three_plant_pot", title: "3-Plant Pot", description: "Grow three flowers from your money habits.", icon: "flower", metric: "flowersGrown", goal: 3 },
  { id: "seven_day_streak", title: "7-Day Streak", description: "Keep a seven day learning streak.", icon: "flame", metric: "streak", goal: 7 },
  { id: "budget_reflector", title: "Budget Reflector", description: "Log your budget for the first time.", icon: "pie-chart", metric: "budgetsLogged", goal: 1 },
  { id: "quiz_ace", title: "Quiz Ace", description: "Pass three knowledge checks.", icon: "school", metric: "quizzesPassed", goal: 3 },
  { id: "first_investor", title: "First Investor", description: "Plant your first investment flower.", icon: "trending-up", metric: "investmentsPlanted", goal: 1 },
  { id: "hundred_planted", title: "100 Planted", description: "Grow one hundred flowers in your garden.", icon: "trophy", metric: "totalFlowers", goal: 100 }
];
