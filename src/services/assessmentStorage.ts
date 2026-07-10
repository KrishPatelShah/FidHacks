import AsyncStorage from "@react-native-async-storage/async-storage";
import { AssessmentPayload } from "@/data/assessment";
import { ConfidenceAssessment } from "@/types/domain";

const ASSESSMENT_KEY = "financial_garden_assessment_v1";

/**
 * Local persistence for the confidence assessment.
 * Swap the body of these helpers for Firebase later without changing call sites.
 */
export async function saveAssessment(assessment: ConfidenceAssessment, userId?: string): Promise<AssessmentPayload> {
  const payload: AssessmentPayload = {
    ...assessment,
    userId,
    version: 1
  };
  await AsyncStorage.setItem(ASSESSMENT_KEY, JSON.stringify(payload));
  // Future: await setDoc(doc(db, "assessments", userId), payload);
  return payload;
}

export async function loadAssessment(): Promise<AssessmentPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(ASSESSMENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentPayload;
  } catch {
    return null;
  }
}

export async function clearAssessment(): Promise<void> {
  await AsyncStorage.removeItem(ASSESSMENT_KEY);
}
