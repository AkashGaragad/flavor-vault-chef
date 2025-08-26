/* Local storage powered store for meal planner and grocery generation */

export type Ingredient = {
  id: string;
  name: string;
  quantity: number; // per recipe serving
  unit: string; // g, kg, ml, l, tbsp, tsp, piece
  calories?: number; // per unit
  protein?: number; // per unit (g)
  carbs?: number; // per unit (g)
  fat?: number; // per unit (g)
};

export type PlannerEntry = { recipeId: string; servings: number } | null;
export type Planner = Record<string, Record<string, PlannerEntry>>; // day -> meal -> entry

const LS = {
  planner: "planner_v1",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
export const constants = { DAYS, MEALS };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ----------------- PLANNER ----------------- */

export function getPlanner(): Planner {
  const base: Planner = Object.fromEntries(
    DAYS.map((d) => [d, Object.fromEntries(MEALS.map((m) => [m, null]))])
  ) as Planner;
  return load<Planner>(LS.planner, base);
}

export function savePlanner(planner: Planner) {
  save(LS.planner, planner);
}

/* ----------------- INGREDIENT SCALING ----------------- */

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
) {
  const factor = targetServings / baseServings;
  return ingredients.map((i) => ({
    ...i,
    quantity: Number((i.quantity * factor).toFixed(2)),
  }));
}

/* ----------------- NUTRITION ----------------- */


export function computeNutrition(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
) {
  const scaled = scaleIngredients(ingredients, baseServings, targetServings);
  return scaled.reduce(
    (acc, i) => {
      const cal = i.calories ?? 0;
      const protein = i.protein ?? 0;
      const carbs = i.carbs ?? 0;
      const fat = i.fat ?? 0;
      return {
        calories:
          acc.calories +
          (cal * (i.unit === "g" || i.unit === "ml" ? i.quantity : 1)),
        protein: acc.protein + protein * (i.unit === "g" ? i.quantity / 100 : 1),
        carbs: acc.carbs + carbs * (i.unit === "g" ? i.quantity / 100 : 1),
        fat: acc.fat + fat * (i.unit === "g" ? i.quantity / 100 : 1),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
/* ----------------- GROCERY LIST ----------------- */

export type GroceryItem = { name: string; total: number; unit: string };

export function generateGroceryList(planner: Planner, recipes: any[]): GroceryItem[] {
  const map = new Map<string, GroceryItem>();

  for (const day of DAYS) {
    for (const meal of MEALS) {
      const entry = planner[day][meal];
      if (!entry) continue;

      const r = recipes.find((x) => x.id === entry.recipeId);
      if (!r) continue;

      const scaled = scaleIngredients(r.ingredients, r.servings, entry.servings);

      for (const ing of scaled) {
        const key = `${ing.name}__${ing.unit}`.toLowerCase();
        const existing = map.get(key);
        if (existing) {
          existing.total = Number((existing.total + ing.quantity).toFixed(2));
        } else {
          map.set(key, { name: ing.name, unit: ing.unit, total: ing.quantity });
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
