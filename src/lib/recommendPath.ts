export function recommendPath(ratings: Record<string, number>): "beginner" | "intermediate" | "advanced" {
  const values = Object.values(ratings);

  if (values.length === 0) {
    return "beginner";
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (average >= 4) {
    return "advanced";
  }

  if (average >= 2.75) {
    return "intermediate";
  }

  return "beginner";
}
