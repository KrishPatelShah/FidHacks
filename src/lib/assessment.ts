import { assessmentQuestions } from "@/data/assessment";
import type { QuestionnairePayload } from "@/services/api";
import { ConfidenceAssessment, ConfidenceLevel, RiskProfile } from "@/types/domain";

export function scoreAssessment(responses: Record<string, number>): Omit<ConfidenceAssessment, "completedAt"> {
  const values = assessmentQuestions.map((question) => responses[question.id]).filter((value): value is number => typeof value === "number");
  const totalScore = values.reduce((sum, value) => sum + value, 0);
  const averageScore = values.length ? totalScore / values.length : 0;

  return {
    responses: { ...responses },
    totalScore,
    averageScore: Math.round(averageScore * 100) / 100,
    level: assignLevel(averageScore)
  };
}

export function assignLevel(average: number): ConfidenceLevel {
  if (average >= 3.8) return "Advanced";
  if (average >= 2.5) return "Intermediate";
  return "Beginner";
}

/** Map overall confidence into the invest-screen risk profile. */
export function riskProfileFromAssessment(assessment: Pick<ConfidenceAssessment, "responses" | "level">): RiskProfile {
  const investing = assessment.responses.investing_basics ?? 0;
  if (investing >= 4 || assessment.level === "Advanced") return "Aggressive";
  if (investing >= 3 || assessment.level === "Intermediate") return "Moderate";
  return "Conservative";
}

export function isAssessmentComplete(responses: Record<string, number>): boolean {
  return assessmentQuestions.every((question) => {
    const value = responses[question.id];
    return typeof value === "number" && value >= 1 && value <= 5;
  });
}

const clamp15 = (value: number): number => Math.min(5, Math.max(1, Math.round(value || 3)));
const avg = (...values: number[]): number => values.reduce((sum, v) => sum + (v || 3), 0) / values.length;

/** Map the 10-question assessment onto the backend's 6-confidence questionnaire. */
export function toQuestionnairePayload(responses: Record<string, number>): QuestionnairePayload {
  const budgeting = avg(responses.monthly_budget, responses.track_spending);
  const savings = responses.emergency_savings ?? 3;
  const credit = responses.credit_basics ?? 3;
  const retirement = responses.retirement_accounts ?? 3;
  const career = responses.job_offer ?? 3;
  const investing = responses.investing_basics ?? 3;

  const areas: { goal: string; score: number }[] = [
    { goal: "build_budgeting_habits", score: budgeting },
    { goal: "save_money", score: savings },
    { goal: "pay_off_debt", score: credit },
    { goal: "prepare_for_career", score: career },
    { goal: "learn_investing", score: investing }
  ];
  const primary_goal = areas.reduce((lowest, area) => (area.score < lowest.score ? area : lowest), areas[0]).goal;

  return {
    budgeting_confidence: clamp15(budgeting),
    savings_confidence: clamp15(savings),
    credit_debt_confidence: clamp15(credit),
    retirement_confidence: clamp15(retirement),
    career_taxes_confidence: clamp15(career),
    investing_confidence: clamp15(investing),
    primary_goal
  };
}
