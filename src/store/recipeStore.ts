/* Simple local storage powered store for recipes, planner and grocery generation */
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

export type Recipe = {
  id: string;
  title: string;
  description?: string;
  image?: string; // data URL
  cuisine?: string;
  dietary?: string[];
  mealTypes?: string[]; // Breakfast, Lunch, Dinner
  tags?: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  timeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  rating?: number;
  createdAt: string;
};

export type PlannerEntry = { recipeId: string; servings: number } | null;
export type Planner = Record<string, Record<string, PlannerEntry>>; // day -> meal -> entry

const LS = {
  recipes: "recipes_v1",
  planner: "planner_v1",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
export const constants = { DAYS, MEALS };

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function seed(): Recipe[] {
  return [
    {
      id: uid(),
      title: "Grilled Salmon with Herb Veggies",
      description: "Vibrant Mediterranean plate with lemony salmon and roasted veggies.",
      cuisine: "Mediterranean",
      dietary: ["Gluten-Free"],
      mealTypes: ["Dinner"],
      tags: ["salmon", "zucchini", "lemon"],
      difficulty: "Easy",
      timeMinutes: 30,
      servings: 2,
      ingredients: [
        { id: uid(), name: "Salmon fillet", quantity: 200, unit: "g", calories: 2.08, protein: 0.20, fat: 0.13 },
        { id: uid(), name: "Zucchini", quantity: 200, unit: "g", calories: 0.17, carbs: 0.03, protein: 0.01 },
        { id: uid(), name: "Olive oil", quantity: 1, unit: "tbsp", calories: 119, fat: 13.5 },
        { id: uid(), name: "Lemon", quantity: 0.5, unit: "piece", calories: 17 },
        { id: uid(), name: "Salt", quantity: 1, unit: "tsp" },
        { id: uid(), name: "Pepper", quantity: 0.5, unit: "tsp" },
      ],
      steps: [
        "Preheat grill or pan to medium-high.",
        "Season salmon; grill 3-4 min per side.",
        "Roast zucchini with olive oil, salt, pepper.",
        "Finish with lemon juice and serve warm.",
      ],
      createdAt: new Date().toISOString(),
    },
  ];
}

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

export function getRecipes(): Recipe[] {
  let recipes = load<Recipe[]>(LS.recipes, []);
  if (recipes.length === 0) {
    recipes = seed();
    save(LS.recipes, recipes);
  }
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return getRecipes().find((r) => r.id === id);
}

export function addRecipe(recipe: Omit<Recipe, "id" | "createdAt">): Recipe {
  const newRecipe: Recipe = { ...recipe, id: uid(), createdAt: new Date().toISOString() };
  const all = [newRecipe, ...getRecipes()];
  save(LS.recipes, all);
  return newRecipe;
}

export function updateRecipe(updated: Recipe) {
  const all = getRecipes().map((r) => (r.id === updated.id ? updated : r));
  save(LS.recipes, all);
}

export function deleteRecipe(id: string) {
  const all = getRecipes().filter((r) => r.id !== id);
  save(LS.recipes, all);
}

export function getPlanner(): Planner {
  const base: Planner = Object.fromEntries(
    DAYS.map((d) => [d, Object.fromEntries(MEALS.map((m) => [m, null]))])
  ) as Planner;
  return load<Planner>(LS.planner, base);
}

export function savePlanner(planner: Planner) {
  save(LS.planner, planner);
}

export function scaleIngredients(ingredients: Ingredient[], baseServings: number, targetServings: number) {
  const factor = targetServings / baseServings;
  return ingredients.map((i) => ({ ...i, quantity: Number((i.quantity * factor).toFixed(2)) }));
}

export function computeNutrition(ingredients: Ingredient[], baseServings: number, targetServings: number) {
  const scaled = scaleIngredients(ingredients, baseServings, targetServings);
  return scaled.reduce(
    (acc, i) => {
      const cal = i.calories ?? 0;
      const protein = i.protein ?? 0;
      const carbs = i.carbs ?? 0;
      const fat = i.fat ?? 0;
      return {
        calories: acc.calories + (cal * (i.unit === "g" || i.unit === "ml" ? i.quantity : 1)),
        protein: acc.protein + protein * (i.unit === "g" ? i.quantity / 100 : 1),
        carbs: acc.carbs + carbs * (i.unit === "g" ? i.quantity / 100 : 1),
        fat: acc.fat + fat * (i.unit === "g" ? i.quantity / 100 : 1),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export type GroceryItem = { name: string; total: number; unit: string };

export function generateGroceryList(planner: Planner, recipes: Recipe[]): GroceryItem[] {
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
