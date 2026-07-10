import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { achievementDefs } from "@/data/achievements";
import { demoPlants } from "@/data/plants";
import { sampleTransactions } from "@/data/transactions";
import { ApiError, Bootstrap, clearAccessToken, demoLogin, getAccessToken, getBootstrap, isBackendUnavailable, QuizAttemptResult } from "@/services/api";
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

const STORAGE_KEY = "financial_garden_local_features_v1";

type PersistedState = {
  budgetsLogged: number;
  investmentsPlanted: number;
  receiptsScanned: number;
  transactions: Transaction[];
  riskProfile: RiskProfile;
  experienceLevel: ExperienceLevel;
  confidenceAssessment: ConfidenceAssessment | null;
  unlockedAchievements: string[];
  streak: number;
  lastActiveISO: string | null;
};

export type ReceiptCommitResult = {
  added: number;
  flowerName: string;
  quantity: number;
};

type GardenContextValue = {
  hydrated: boolean;
  loadingAccount: boolean;
  accountError: string | null;
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
  confidenceAssessment: ConfidenceAssessment | null;
  confidenceLevel: ConfidenceLevel | null;
  totals: { sunlight: number; water: number; fertilizer: number };
  totalFlowers: number;
  unlockedAchievements: string[];
  celebration: Achievement | null;
  logBudget: (category?: PlantCategory) => void;
  plantInvestment: (category: PlantCategory) => void;
  addTransaction: (input: { merchant: string; amount: number; category: SpendCategory; source: TransactionSource; note?: string }) => void;
  commitReceipt: (receipt: ParsedReceipt) => ReceiptCommitResult;
  setRiskProfile: (profile: RiskProfile) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  saveConfidenceAssessment: (assessment: ConfidenceAssessment, profile: RiskProfile) => void;
  startFreshGarden: () => void;
  dismissCelebration: () => void;
  resetLocalDemoData: () => void;
  loginDemo: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  applyQuizResult: (result: QuizAttemptResult) => void;
};

const GardenContext = createContext<GardenContextValue | null>(null);

function cloneDemo(): Plant[] {
  return demoPlants.map((plant) => ({ ...plant }));
}

function startOfDayMs(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// Whole calendar days (local time) between a stored ISO date and now.
function daysBetween(fromISO: string, now: Date): number {
  return Math.round((startOfDayMs(now) - startOfDayMs(new Date(fromISO))) / 86_400_000);
}

let localId = 0;
function nextId() {
  localId += 1;
  return `txn_local_${Date.now()}_${localId}`;
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(cloneDemo);
  const [streak, setStreak] = useState(0);
  const [lastActiveISO, setLastActiveISO] = useState<string | null>(null);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizzesPassed, setQuizzesPassed] = useState(0);
  const [budgetsLogged, setBudgetsLogged] = useState(0);
  const [flowersGrown, setFlowersGrown] = useState(0);
  const [investmentsPlanted, setInvestmentsPlanted] = useState(0);
  const [receiptsScanned, setReceiptsScanned] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile>("Moderate");
  const [experienceLevel, setExperienceLevelState] = useState<ExperienceLevel>("beginner");
  const [confidenceAssessment, setConfidenceAssessment] = useState<ConfidenceAssessment | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const hydratedRef = useRef(false);
  const seededRef = useRef(false);

  function applyBootstrap(account: Bootstrap) {
    setPlants(account.plants);
    // The backend does not yet track daily streaks (seeded to 0), so only let a
    // real server-side streak override the locally tracked one.
    if (account.profile.streakCount > 0) setStreak(account.profile.streakCount);
    setLessonsCompleted(account.lessonsCompleted);
    setQuizzesPassed(account.quizzesPassed);
  }

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          if (typeof parsed.budgetsLogged === "number") setBudgetsLogged(parsed.budgetsLogged);
          if (typeof parsed.investmentsPlanted === "number") setInvestmentsPlanted(parsed.investmentsPlanted);
          if (typeof parsed.receiptsScanned === "number") setReceiptsScanned(parsed.receiptsScanned);
          if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
          if (parsed.riskProfile) setRiskProfileState(parsed.riskProfile);
          if (parsed.experienceLevel) setExperienceLevelState(parsed.experienceLevel);
          if (parsed.confidenceAssessment) setConfidenceAssessment(parsed.confidenceAssessment);
          if (Array.isArray(parsed.unlockedAchievements)) setUnlockedAchievements(parsed.unlockedAchievements);

          // Reconcile the daily streak against today's date: the same day keeps
          // it, a consecutive day bumps it by one, and a missed day restarts at 1.
          const savedLast = typeof parsed.lastActiveISO === "string" ? parsed.lastActiveISO : null;
          const savedStreak = typeof parsed.streak === "number" ? parsed.streak : 0;
          if (savedLast) {
            const now = new Date();
            const diff = daysBetween(savedLast, now);
            if (diff <= 0) {
              setStreak(savedStreak);
              setLastActiveISO(savedLast);
            } else if (diff === 1) {
              setStreak(savedStreak + 1);
              setLastActiveISO(now.toISOString());
            } else {
              setStreak(1);
              setLastActiveISO(now.toISOString());
            }
          }
        }
      } catch {
        // Ignore corrupt cache and start from the demo garden.
      }
      try {
        const token = await getAccessToken();
        if (token) {
          setLoadingAccount(true);
          try {
            const account = await getBootstrap();
            applyBootstrap(account);
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              await clearAccessToken();
              setAccountError("Your demo session expired. Sign in again to load your garden.");
            } else if (!isBackendUnavailable(error)) {
              setAccountError(error instanceof Error ? error.message : "Could not load your garden.");
            }
            // Backend unavailable: keep the local demo garden and run offline.
          } finally {
            setLoadingAccount(false);
          }
        }
      } catch {
        // A missing or unreadable token should not block local demo-only features.
      } finally {
        hydratedRef.current = true;
        setHydrated(true);
      }
    })();
  }, []);

  const refreshAccount = useCallback(async () => {
    setLoadingAccount(true);
    setAccountError(null);
    try {
      applyBootstrap(await getBootstrap());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await clearAccessToken();
      }
      // Offline: keep the current (local) garden without surfacing an error so
      // the learning flow can continue even when the backend is down.
      if (isBackendUnavailable(error)) {
        setLoadingAccount(false);
        return;
      }
      setAccountError(error instanceof Error ? error.message : "Could not load your garden.");
      throw error;
    } finally {
      setLoadingAccount(false);
    }
  }, []);

  const loginDemo = useCallback(async () => {
    setLoadingAccount(true);
    setAccountError(null);
    try {
      await demoLogin();
      await refreshAccount();
    } finally {
      setLoadingAccount(false);
    }
  }, [refreshAccount]);

  const applyQuizResult = useCallback((result: QuizAttemptResult) => {
    if (result.plant) {
      const previous = plants.find((plant) => plant.id === result.plant!.id);
      if (previous && result.plant.quantity > previous.quantity) {
        setFlowersGrown((count) => count + result.plant!.quantity - previous.quantity);
      }
      setPlants((current) => current.map((plant) => plant.id === result.plant!.id ? result.plant! : plant));
    } else if (result.local && result.passed && result.category) {
      // Offline reward: grow the matching plant client-side since the server
      // could not verify the attempt.
      const now = new Date().toISOString();
      let grew = false;
      setPlants((current) =>
        current.map((plant) => {
          if (plant.type !== result.category) return plant;
          grew = true;
          return {
            ...plant,
            unlocked: true,
            quantity: plant.quantity + 1,
            growth: Math.min(100, plant.growth + 20),
            stage: plant.stage + 1,
            water: plant.water + (result.earned.water ?? 0),
            sunlight: plant.sunlight + (result.earned.sunlight ?? 0),
            fertilizer: plant.fertilizer + (result.earned.fertilizer ?? 0),
            updatedAt: now
          };
        })
      );
      if (grew) setFlowersGrown((count) => count + 1);
      setLessonsCompleted((count) => count + 1);
      setQuizzesPassed((count) => count + 1);
    }
    if (result.profile && result.profile.streakCount > 0) setStreak(result.profile.streakCount);
    if (typeof result.lessonsCompleted === "number") setLessonsCompleted(result.lessonsCompleted);
    if (typeof result.quizzesPassed === "number") setQuizzesPassed(result.quizzesPassed);
  }, [plants]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const state: PersistedState = {
      budgetsLogged,
      investmentsPlanted,
      receiptsScanned,
      transactions,
      riskProfile,
      experienceLevel,
      confidenceAssessment,
      unlockedAchievements,
      streak,
      lastActiveISO
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [budgetsLogged, investmentsPlanted, receiptsScanned, transactions, riskProfile, experienceLevel, confidenceAssessment, unlockedAchievements, streak, lastActiveISO]);

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
      if (seededRef.current) {
        const unlocked = fresh.map((id) => achievementDefs.find((a) => a.id === id)).filter((a): a is Achievement => Boolean(a));
        setCelebrationQueue((queue) => [...queue, ...unlocked]);
      }
      if (prev.length === satisfied.length && prev.every((id) => satisfied.includes(id))) return prev;
      return satisfied;
    });
    seededRef.current = true;
  }, [hydrated, metrics]);

  const logBudget = useCallback(
    (_category: PlantCategory = "budgeting") => {
      setBudgetsLogged((count) => count + 1);
    },
    []
  );

  const plantInvestment = useCallback(
    (_category: PlantCategory) => {
      setInvestmentsPlanted((count) => count + 1);
    },
    []
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

  const setRiskProfile = useCallback((profile: RiskProfile) => setRiskProfileState(profile), []);

  const setExperienceLevel = useCallback((level: ExperienceLevel) => setExperienceLevelState(level), []);

  const saveConfidenceAssessment = useCallback((assessment: ConfidenceAssessment, profile: RiskProfile) => {
    setConfidenceAssessment(assessment);
    setRiskProfileState(profile);
  }, []);

  // Save a scanned receipt: add one transaction per item and reward the garden
  // with one brand-new budget flower, plus bump the receipt count which unlocks
  // the "First Receipt Sprout!" achievement. (Client-side demo reward.)
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
    // Creating the account (finishing onboarding) is the first step: start the
    // streak at day 1 rather than 0.
    setStreak(1);
    setLastActiveISO(new Date().toISOString());
    setLessonsCompleted(0);
    setQuizzesPassed(0);
    setBudgetsLogged(0);
    setFlowersGrown(0);
    setInvestmentsPlanted(0);
    setUnlockedAchievements([]);
    setCelebrationQueue([]);
    seededRef.current = false;
  }, []);

  const dismissCelebration = useCallback(() => setCelebrationQueue((queue) => queue.slice(1)), []);

  const resetLocalDemoData = useCallback(() => {
    setBudgetsLogged(0);
    setFlowersGrown(0);
    setInvestmentsPlanted(0);
    setReceiptsScanned(0);
    setStreak(0);
    setLastActiveISO(null);
    setTransactions(sampleTransactions);
    setRiskProfileState("Moderate");
    setExperienceLevelState("beginner");
    setConfidenceAssessment(null);
    setUnlockedAchievements([]);
    setCelebrationQueue([]);
    seededRef.current = false;
    clearAssessment().catch(() => {});
  }, []);

  const value = useMemo<GardenContextValue>(
    () => ({
      hydrated,
      loadingAccount,
      accountError,
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
      confidenceAssessment,
      confidenceLevel: confidenceAssessment?.level ?? null,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebration: celebrationQueue[0] ?? null,
      logBudget,
      plantInvestment,
      addTransaction,
      commitReceipt,
      setRiskProfile,
      setExperienceLevel,
      saveConfidenceAssessment,
      startFreshGarden,
      dismissCelebration,
      resetLocalDemoData,
      loginDemo,
      refreshAccount,
      applyQuizResult
    }),
    [
      hydrated,
      loadingAccount,
      accountError,
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
      confidenceAssessment,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebrationQueue,
      logBudget,
      plantInvestment,
      addTransaction,
      commitReceipt,
      setRiskProfile,
      setExperienceLevel,
      saveConfidenceAssessment,
      startFreshGarden,
      dismissCelebration,
      resetLocalDemoData,
      loginDemo,
      refreshAccount,
      applyQuizResult
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
