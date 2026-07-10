import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { achievementDefs } from "@/data/achievements";
import { demoPlants } from "@/data/plants";
import { sampleTransactions } from "@/data/transactions";
import { applyGardenReward, GARDEN_REWARDS, GardenAction } from "@/lib/gardenGrowth";
import { fetchPlants, growPlantRemote } from "@/services/api";
import { clearAssessment } from "@/services/assessmentStorage";
import {
  Achievement,
  AchievementMetric,
  ConfidenceAssessment,
  ConfidenceLevel,
  ExperienceLevel,
  ParsedReceipt,
  Plant,
  PlantCategory,
  RiskProfile,
  SpendCategory,
  Transaction,
  TransactionSource
} from "@/types/domain";

const STORAGE_KEY = "financial_garden_state_v2";

type PersistedState = {
  plants: Plant[];
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  budgetsLogged: number;
  flowersGrown: number;
  investmentsPlanted: number;
  receiptsScanned: number;
  transactions: Transaction[];
  riskProfile: RiskProfile;
  experienceLevel: ExperienceLevel;
  unlockedAchievements: string[];
  confidenceAssessment: ConfidenceAssessment | null;
};

export type ReceiptCommitResult = {
  added: number;
  flowerName: string;
  quantity: number;
};

export type GrowthResult = {
  flowerName: string;
  category: PlantCategory;
  earnedFlower: boolean;
  quantity: number;
  growth: number;
};

type GardenContextValue = {
  hydrated: boolean;
  backendConnected: boolean;
  plants: Plant[];
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  budgetsLogged: number;
  flowersGrown: number;
  investmentsPlanted: number;
  receiptsScanned: number;
  transactions: Transaction[];
  riskProfile: RiskProfile;
  confidenceAssessment: ConfidenceAssessment | null;
  confidenceLevel: ConfidenceLevel | null;
  experienceLevel: ExperienceLevel;
  totals: { sunlight: number; water: number; fertilizer: number };
  totalFlowers: number;
  unlockedAchievements: string[];
  celebration: Achievement | null;
  completeLesson: (category: PlantCategory) => GrowthResult | null;
  passQuiz: (category: PlantCategory) => GrowthResult | null;
  logBudget: (category?: PlantCategory) => GrowthResult | null;
  plantInvestment: (category: PlantCategory) => GrowthResult | null;
  addTransaction: (input: { merchant: string; amount: number; category: SpendCategory; source: TransactionSource; note?: string }) => void;
  commitReceipt: (receipt: ParsedReceipt) => ReceiptCommitResult;
  setRiskProfile: (profile: RiskProfile) => void;
  saveConfidenceAssessment: (assessment: ConfidenceAssessment, profile: RiskProfile) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  dismissCelebration: () => void;
  startFreshGarden: () => void;
  resetGarden: () => void;
};

const GardenContext = createContext<GardenContextValue | null>(null);

function cloneDemo(): Plant[] {
  return demoPlants.map((plant) => ({ ...plant }));
}

// Merge backend plants over a base set: backend is the source of truth for any
// plant category it knows about, while base-only categories (e.g. the client's
// investment flowers, not seeded in the DB) are preserved.
function mergeBackendPlants(base: Plant[], backend: Plant[]): Plant[] {
  const byType = new Map(backend.map((plant) => [plant.type, plant]));
  const merged = base.map((plant) => byType.get(plant.type) ?? plant);
  for (const plant of backend) {
    if (!merged.some((p) => p.type === plant.type)) merged.push(plant);
  }
  return merged;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isBackendId(id: string): boolean {
  return UUID_RE.test(id);
}

let localId = 0;
function nextId() {
  localId += 1;
  return `txn_local_${Date.now()}_${localId}`;
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(cloneDemo);
  const [streak, setStreak] = useState(7);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizzesPassed, setQuizzesPassed] = useState(0);
  const [budgetsLogged, setBudgetsLogged] = useState(0);
  const [flowersGrown, setFlowersGrown] = useState(0);
  const [investmentsPlanted, setInvestmentsPlanted] = useState(0);
  const [receiptsScanned, setReceiptsScanned] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile>("Moderate");
  const [confidenceAssessment, setConfidenceAssessment] = useState<ConfidenceAssessment | null>(null);
  const [experienceLevel, setExperienceLevelState] = useState<ExperienceLevel>("beginner");
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const hydratedRef = useRef(false);
  const seededRef = useRef(false);

  useEffect(() => {
    (async () => {
      let hadLocalPlants = false;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          if (Array.isArray(parsed.plants) && parsed.plants.length) {
            setPlants(parsed.plants);
            hadLocalPlants = true;
          }
          if (typeof parsed.streak === "number") setStreak(parsed.streak);
          if (typeof parsed.lessonsCompleted === "number") setLessonsCompleted(parsed.lessonsCompleted);
          if (typeof parsed.quizzesPassed === "number") setQuizzesPassed(parsed.quizzesPassed);
          if (typeof parsed.budgetsLogged === "number") setBudgetsLogged(parsed.budgetsLogged);
          if (typeof parsed.flowersGrown === "number") setFlowersGrown(parsed.flowersGrown);
          if (typeof parsed.investmentsPlanted === "number") setInvestmentsPlanted(parsed.investmentsPlanted);
          if (typeof parsed.receiptsScanned === "number") setReceiptsScanned(parsed.receiptsScanned);
          if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
          if (parsed.riskProfile) setRiskProfileState(parsed.riskProfile);
          if (parsed.confidenceAssessment) setConfidenceAssessment(parsed.confidenceAssessment);
          if (parsed.experienceLevel) setExperienceLevelState(parsed.experienceLevel);
          if (Array.isArray(parsed.unlockedAchievements)) setUnlockedAchievements(parsed.unlockedAchievements);
        }
      } catch {
        // Ignore corrupt cache and start from the demo garden.
      }

      // Pull the garden from the FastAPI backend (Postgres). On a fresh install
      // this becomes the source of truth; when local demo progress already
      // exists we keep it and just mark the backend as connected.
      try {
        const backendPlants = await fetchPlants();
        if (backendPlants && backendPlants.length) {
          setBackendConnected(true);
          if (!hadLocalPlants) {
            setPlants((current) => mergeBackendPlants(current, backendPlants));
          }
        }
      } catch {
        // Backend offline — the app runs fully on local demo data.
      }

      hydratedRef.current = true;
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const state: PersistedState = {
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      flowersGrown,
      investmentsPlanted,
      receiptsScanned,
      transactions,
      riskProfile,
      experienceLevel,
      unlockedAchievements,
      confidenceAssessment
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [
    plants,
    streak,
    lessonsCompleted,
    quizzesPassed,
    budgetsLogged,
    flowersGrown,
    investmentsPlanted,
    receiptsScanned,
    transactions,
    riskProfile,
    experienceLevel,
    unlockedAchievements,
    confidenceAssessment
  ]);

  const totals = useMemo(
    () =>
      plants.reduce(
        (sum, plant) => ({
          sunlight: sum.sunlight + plant.sunlight,
          water: sum.water + plant.water,
          fertilizer: sum.fertilizer + plant.fertilizer
        }),
        { sunlight: 0, water: 0, fertilizer: 0 }
      ),
    [plants]
  );

  const totalFlowers = useMemo(() => plants.reduce((sum, plant) => sum + plant.quantity, 0), [plants]);

  const metrics = useMemo<Record<AchievementMetric, number>>(
    () => ({
      flowersGrown,
      streak,
      totalFlowers,
      budgetsLogged,
      quizzesPassed,
      lessonsCompleted,
      investmentsPlanted,
      receiptsScanned
    }),
    [flowersGrown, streak, totalFlowers, budgetsLogged, quizzesPassed, lessonsCompleted, investmentsPlanted, receiptsScanned]
  );

  // Unlock achievements as metrics cross their goals. The first pass after hydration
  // seeds already-earned achievements silently so we don't celebrate old progress.
  useEffect(() => {
    if (!hydrated) return;
    const satisfied = achievementDefs.filter((a) => metrics[a.metric] >= a.goal).map((a) => a.id);
    setUnlockedAchievements((prev) => {
      const fresh = satisfied.filter((id) => !prev.includes(id));
      if (fresh.length === 0) return prev;
      if (seededRef.current) {
        const unlocked = fresh.map((id) => achievementDefs.find((a) => a.id === id)).filter((a): a is Achievement => Boolean(a));
        setCelebrationQueue((queue) => [...queue, ...unlocked]);
      }
      return [...prev, ...fresh];
    });
    seededRef.current = true;
  }, [hydrated, metrics]);

  const grow = useCallback(
    (category: PlantCategory, action: GardenAction): GrowthResult | null => {
      let result: GrowthResult | null = null;
      let syncId: string | null = null;
      setPlants((current) =>
        current.map((plant) => {
          if (plant.type !== category) return plant;
          const before = plant.quantity;
          const next = applyGardenReward({ ...plant, unlocked: true }, action);
          result = {
            flowerName: next.flowerName,
            category: next.type,
            earnedFlower: next.quantity > before,
            quantity: next.quantity,
            growth: next.growth
          };
          if (isBackendId(plant.id)) syncId = plant.id;
          return next;
        })
      );
      if (result && (result as GrowthResult).earnedFlower) {
        setFlowersGrown((count) => count + 1);
      }
      // Best-effort: persist the reward to Postgres via FastAPI.
      if (backendConnected && syncId) {
        const reward = GARDEN_REWARDS[action];
        growPlantRemote(syncId, { sunlight: reward.sunlight, water: reward.water, fertilizer: reward.fertilizer });
      }
      return result;
    },
    [backendConnected]
  );

  const completeLesson = useCallback(
    (category: PlantCategory) => {
      setLessonsCompleted((count) => count + 1);
      return grow(category, "complete_lesson");
    },
    [grow]
  );

  const passQuiz = useCallback(
    (category: PlantCategory) => {
      setQuizzesPassed((count) => count + 1);
      return grow(category, "pass_quiz");
    },
    [grow]
  );

  const logBudget = useCallback(
    (category: PlantCategory = "budgeting") => {
      setBudgetsLogged((count) => count + 1);
      return grow(category, "log_budget");
    },
    [grow]
  );

  const plantInvestment = useCallback(
    (category: PlantCategory) => {
      setInvestmentsPlanted((count) => count + 1);
      return grow(category, "plant_investment");
    },
    [grow]
  );

  const addTransaction = useCallback(
    (input: { merchant: string; amount: number; category: SpendCategory; source: TransactionSource; note?: string }) => {
      const txn: Transaction = {
        id: nextId(),
        merchant: input.merchant,
        amount: input.amount,
        category: input.category,
        source: input.source,
        date: new Date().toISOString(),
        note: input.note
      };
      setTransactions((current) => [txn, ...current]);
    },
    []
  );

  // Save a scanned receipt: add one transaction per item and reward the garden
  // with one brand-new budget plant (a fresh sprout), plus bump the receipt count
  // which unlocks the "First Receipt Sprout!" achievement.
  const commitReceipt = useCallback((receipt: ParsedReceipt): ReceiptCommitResult => {
    const now = new Date().toISOString();
    const newTxns: Transaction[] = receipt.items.map((item, index) => ({
      id: `${nextId()}_${index}`,
      merchant: receipt.merchant,
      amount: item.price,
      category: item.category,
      source: "scanned",
      date: receipt.date ? new Date(receipt.date).toISOString() : now,
      note: item.name
    }));
    setTransactions((current) => [...newTxns, ...current]);
    setReceiptsScanned((count) => count + 1);

    let flowerName = "Daisy";
    let quantity = 0;
    setPlants((current) =>
      current.map((plant) => {
        if (plant.type !== "budgeting") return plant;
        flowerName = plant.flowerName;
        quantity = plant.quantity + 1;
        return { ...plant, unlocked: true, quantity, stage: plant.stage + 1, updatedAt: now };
      })
    );
    setFlowersGrown((count) => count + 1);

    return { added: newTxns.length, flowerName, quantity };
  }, []);

  const setRiskProfile = useCallback((profile: RiskProfile) => setRiskProfileState(profile), []);

  const saveConfidenceAssessment = useCallback((assessment: ConfidenceAssessment, profile: RiskProfile) => {
    setConfidenceAssessment(assessment);
    setRiskProfileState(profile);
  }, []);

  const setExperienceLevel = useCallback((level: ExperienceLevel) => setExperienceLevelState(level), []);

  const dismissCelebration = useCallback(() => setCelebrationQueue((queue) => queue.slice(1)), []);

  // A brand-new user finishing onboarding starts with an empty clearing: the
  // plant categories exist but nothing has been grown yet.
  const startFreshGarden = useCallback(() => {
    setPlants(
      demoPlants.map((plant) => ({
        ...plant,
        quantity: 0,
        growth: 0,
        stage: 0,
        water: 0,
        sunlight: 0,
        fertilizer: 0,
        unlocked: false
      }))
    );
    setStreak(0);
    setLessonsCompleted(0);
    setQuizzesPassed(0);
    setBudgetsLogged(0);
    setFlowersGrown(0);
    setInvestmentsPlanted(0);
    setUnlockedAchievements([]);
    setCelebrationQueue([]);
    seededRef.current = false;
  }, []);

  const resetGarden = useCallback(() => {
    setPlants(cloneDemo());
    setStreak(7);
    setLessonsCompleted(0);
    setQuizzesPassed(0);
    setBudgetsLogged(0);
    setFlowersGrown(0);
    setInvestmentsPlanted(0);
    setReceiptsScanned(0);
    setTransactions(sampleTransactions);
    setRiskProfileState("Moderate");
    setConfidenceAssessment(null);
    setExperienceLevelState("beginner");
    setUnlockedAchievements([]);
    setCelebrationQueue([]);
    seededRef.current = false;
    clearAssessment().catch(() => {});
  }, []);

  const value = useMemo<GardenContextValue>(
    () => ({
      hydrated,
      backendConnected,
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      flowersGrown,
      investmentsPlanted,
      receiptsScanned,
      transactions,
      riskProfile,
      confidenceAssessment,
      confidenceLevel: confidenceAssessment?.level ?? null,
      experienceLevel,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebration: celebrationQueue[0] ?? null,
      completeLesson,
      passQuiz,
      logBudget,
      plantInvestment,
      addTransaction,
      commitReceipt,
      setRiskProfile,
      saveConfidenceAssessment,
      setExperienceLevel,
      dismissCelebration,
      startFreshGarden,
      resetGarden
    }),
    [
      hydrated,
      backendConnected,
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      flowersGrown,
      investmentsPlanted,
      receiptsScanned,
      transactions,
      riskProfile,
      confidenceAssessment,
      experienceLevel,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebrationQueue,
      completeLesson,
      passQuiz,
      logBudget,
      plantInvestment,
      addTransaction,
      commitReceipt,
      setRiskProfile,
      saveConfidenceAssessment,
      setExperienceLevel,
      dismissCelebration,
      startFreshGarden,
      resetGarden
    ]
  );

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden(): GardenContextValue {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return context;
}
