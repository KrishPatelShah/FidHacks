import { assignLevel } from "@/lib/assessment";

/** @deprecated Prefer scoreAssessment / assignLevel from @/lib/assessment */
export function recommendPath(ratings: Record<string, number>): "beginner" | "intermediate" | "advanced" {
  const values = Object.values(ratings);
  if (values.length === 0) return "beginner";
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const level = assignLevel(average);
  return level.toLowerCase() as "beginner" | "intermediate" | "advanced";
}
