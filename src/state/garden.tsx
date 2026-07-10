import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { achievementDefs } from "@/data/achievements";
import { demoPlants } from "@/data/plants";
import { sampleTransactions } from "@/data/transactions";
import { applyGardenReward, GardenAction } from "@/lib/gardenGrowth";
import { Bootstrap, clearAccessToken, demoLogin, getAccessToken, getBootstrap, QuizAttemptResult } from "@/services/api";
import { Achievement, AchievementMetric, Plant, PlantCategory, RiskProfile, SpendCategory, Transaction, TransactionSource } from "@/types/domain";

const STORAGE_KEY = "financial_garden_local_features_v1";

type PersistedState = {
  budgetsLogged: number;
  investmentsPlanted: number;
  transactions: Transaction[];
  riskProfile: RiskProfile;
  unlockedAchievements: string[];
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
  authenticated: boolean;
  loadingAccount: boolean;
  accountError: string | null;
  plants: Plant[];
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  budgetsLogged: number;
  flowersGrown: number;
  investmentsPlanted: number;
  transactions: Transaction[];
  riskProfile: RiskProfile;
  totals: { sunlight: number; water: number; fertilizer: number };
  totalFlowers: number;
  unlockedAchievements: string[];
  celebration: Achievement | null;
  logBudget: (category?: PlantCategory) => GrowthResult | null;
  plantInvestment: (category: PlantCategory) => GrowthResult | null;
  addTransaction: (input: { merchant: string; amount: number; category: SpendCategory; source: TransactionSource; note?: string }) => void;
  setRiskProfile: (profile: RiskProfile) => void;
  dismissCelebration: () => void;
  resetGarden: () => void;
  loginDemo: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  applyQuizResult: (result: QuizAttemptResult) => void;
  clearSession: () => Promise<void>;
};

const GardenContext = createContext<GardenContextValue | null>(null);

function cloneDemo(): Plant[] {
  return demoPlants.map((plant) => ({ ...plant }));
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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile>("Moderate");
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const hydratedRef = useRef(false);
  const seededRef = useRef(false);

  function applyBootstrap(account: Bootstrap) {
    setPlants(account.plants);
    setStreak(account.profile.streakCount);
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
          if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
          if (parsed.riskProfile) setRiskProfileState(parsed.riskProfile);
          if (Array.isArray(parsed.unlockedAchievements)) setUnlockedAchievements(parsed.unlockedAchievements);
        }
      } catch {
        // Ignore corrupt cache and start from the demo garden.
      }
      try {
        const token = await getAccessToken();
        if (token) {
          setAuthenticated(true);
          setLoadingAccount(true);
          try {
            const account = await getBootstrap();
            applyBootstrap(account);
          } catch (error) {
            setAccountError(error instanceof Error ? error.message : "Could not load your garden.");
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
      setAuthenticated(true);
    } catch (error) {
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

  const clearSession = useCallback(async () => {
    await clearAccessToken();
    setAuthenticated(false);
    setAccountError(null);
  }, []);

  const applyQuizResult = useCallback((result: QuizAttemptResult) => {
    if (result.plant) {
      setPlants((current) => current.map((plant) => plant.id === result.plant!.id ? result.plant! : plant));
    }
    if (result.profile) setStreak(result.profile.streakCount);
    if (typeof result.lessonsCompleted === "number") setLessonsCompleted(result.lessonsCompleted);
    if (typeof result.quizzesPassed === "number") setQuizzesPassed(result.quizzesPassed);
    if (result.passed) setQuizzesPassed((count) => typeof result.quizzesPassed === "number" ? result.quizzesPassed : count + 1);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const state: PersistedState = {
      budgetsLogged,
      investmentsPlanted,
      transactions,
      riskProfile,
      unlockedAchievements
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [budgetsLogged, investmentsPlanted, transactions, riskProfile, unlockedAchievements]);

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
      investmentsPlanted
    }),
    [flowersGrown, streak, totalFlowers, budgetsLogged, quizzesPassed, lessonsCompleted, investmentsPlanted]
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

  const grow = useCallback((category: PlantCategory, action: GardenAction): GrowthResult | null => {
    let result: GrowthResult | null = null;
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
        return next;
      })
    );
    if (result && (result as GrowthResult).earnedFlower) {
      setFlowersGrown((count) => count + 1);
    }
    return result;
  }, []);

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

  const setRiskProfile = useCallback((profile: RiskProfile) => setRiskProfileState(profile), []);

  const dismissCelebration = useCallback(() => setCelebrationQueue((queue) => queue.slice(1)), []);

  const resetGarden = useCallback(() => {
    setPlants(cloneDemo());
    setStreak(7);
    setLessonsCompleted(0);
    setQuizzesPassed(0);
    setBudgetsLogged(0);
    setFlowersGrown(0);
    setInvestmentsPlanted(0);
    setTransactions(sampleTransactions);
    setRiskProfileState("Moderate");
    setUnlockedAchievements([]);
    setCelebrationQueue([]);
    seededRef.current = false;
  }, []);

  const value = useMemo<GardenContextValue>(
    () => ({
      hydrated,
      authenticated,
      loadingAccount,
      accountError,
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      flowersGrown,
      investmentsPlanted,
      transactions,
      riskProfile,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebration: celebrationQueue[0] ?? null,
      logBudget,
      plantInvestment,
      addTransaction,
      setRiskProfile,
      dismissCelebration,
      resetGarden,
      loginDemo,
      refreshAccount,
      applyQuizResult,
      clearSession
    }),
    [
      hydrated,
      authenticated,
      loadingAccount,
      accountError,
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      flowersGrown,
      investmentsPlanted,
      transactions,
      riskProfile,
      totals,
      totalFlowers,
      unlockedAchievements,
      celebrationQueue,
      logBudget,
      plantInvestment,
      addTransaction,
      setRiskProfile,
      dismissCelebration,
      resetGarden,
      loginDemo,
      refreshAccount,
      applyQuizResult,
      clearSession
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
