import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getPlanner, generateGroceryList } from "@/store/recipeStore";

const Grocery = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Local meal planner (kept in localStorage)
  const planner = getPlanner();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("recipes").select("*");

      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  // ✅ Generate grocery list from Supabase recipes + local planner
  const items = generateGroceryList(planner, recipes);

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Grocery List | Personal Recipe Collection</title>
        <meta
          name="description"
          content="Automatic grocery list from your meal plan with consolidated quantities."
        />
        <link rel="canonical" href="/grocery" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Grocery List</h1>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-muted-foreground">Loading grocery list...</div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground">
              No planned meals yet. Add recipes to your weekly planner.
            </div>
          ) : (
            <ul className="grid md:grid-cols-2 gap-3">
              {items.map((it) => (
                <li
                  key={`${it.name}-${it.unit}`}
                  className="flex justify-between border rounded-md p-3"
                >
                  <span className="font-medium">{it.name}</span>
                  <span className="text-muted-foreground">
                    {it.total} {it.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Grocery;
