import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { demoPlants } from "@/data/plants";
import { applyGardenReward, GardenAction } from "@/lib/gardenGrowth";
import { Plant, PlantCategory } from "@/types/domain";

const STORAGE_KEY = "financial_garden_state_v1";

type PersistedState = {
  plants: Plant[];
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  budgetsLogged: number;
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
  plants: Plant[];
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  budgetsLogged: number;
  totals: { sunlight: number; water: number; fertilizer: number };
  totalFlowers: number;
  completeLesson: (category: PlantCategory) => GrowthResult | null;
  passQuiz: (category: PlantCategory) => GrowthResult | null;
  logBudget: (category?: PlantCategory) => GrowthResult | null;
  resetGarden: () => void;
};

const GardenContext = createContext<GardenContextValue | null>(null);

function cloneDemo(): Plant[] {
  return demoPlants.map((plant) => ({ ...plant }));
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(cloneDemo);
  const [streak, setStreak] = useState(7);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizzesPassed, setQuizzesPassed] = useState(0);
  const [budgetsLogged, setBudgetsLogged] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedState;
          if (Array.isArray(parsed.plants) && parsed.plants.length) {
            setPlants(parsed.plants);
          }
          if (typeof parsed.streak === "number") setStreak(parsed.streak);
          if (typeof parsed.lessonsCompleted === "number") setLessonsCompleted(parsed.lessonsCompleted);
          if (typeof parsed.quizzesPassed === "number") setQuizzesPassed(parsed.quizzesPassed);
          if (typeof parsed.budgetsLogged === "number") setBudgetsLogged(parsed.budgetsLogged);
        }
      } catch {
        // Ignore corrupt cache and start from the demo garden.
      } finally {
        hydratedRef.current = true;
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const state: PersistedState = { plants, streak, lessonsCompleted, quizzesPassed, budgetsLogged };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [plants, streak, lessonsCompleted, quizzesPassed, budgetsLogged]);

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
    return result;
  }, []);

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

  const resetGarden = useCallback(() => {
    setPlants(cloneDemo());
    setStreak(7);
    setLessonsCompleted(0);
    setQuizzesPassed(0);
    setBudgetsLogged(0);
  }, []);

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

  const value = useMemo<GardenContextValue>(
    () => ({
      hydrated,
      plants,
      streak,
      lessonsCompleted,
      quizzesPassed,
      budgetsLogged,
      totals,
      totalFlowers,
      completeLesson,
      passQuiz,
      logBudget,
      resetGarden
    }),
    [hydrated, plants, streak, lessonsCompleted, quizzesPassed, budgetsLogged, totals, totalFlowers, completeLesson, passQuiz, logBudget, resetGarden]
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
