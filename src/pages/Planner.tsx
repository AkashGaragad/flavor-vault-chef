import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getPlanner, savePlanner, constants } from "@/store/recipeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Planner = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [planner, setPlanner] = useState(getPlanner());
  const [loading, setLoading] = useState(true);

  // ✅ Load recipes from Supabase
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading recipes:", error);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  // ✅ Save planner to localStorage whenever it changes
  useEffect(() => {
    savePlanner(planner);
  }, [planner]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (day: string, meal: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setPlanner((p) => ({
      ...p,
      [day]: { ...p[day], [meal]: { recipeId: id, servings: 2 } },
    }));
  };

  const onClear = (day: string, meal: string) => {
    setPlanner((p) => ({ ...p, [day]: { ...p[day], [meal]: null } }));
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Meal Planner | Personal Recipe Collection</title>
        <meta
          name="description"
          content="Plan your week with drag-and-drop scheduling for breakfast, lunch, and dinner."
        />
        <link rel="canonical" href="/planner" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Weekly Meal Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: recipe list */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            {loading ? (
              <div className="text-muted-foreground">Loading recipes...</div>
            ) : recipes.length === 0 ? (
              <div className="text-muted-foreground">No recipes found. Add some first!</div>
            ) : (
              recipes.map((r) => (
                <div
                  key={r.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, r.id)}
                  className="p-3 rounded-md border hover:bg-secondary cursor-grab active:cursor-grabbing"
                  title="Drag to a day/meal slot"
                >
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.timeMinutes} min • {r.difficulty}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right column: planner grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-4 gap-4">
            <div></div>
            {constants.DAYS.map((d) => (
              <div key={d} className="text-center font-medium">
                {d}
              </div>
            ))}
          </div>
          {["Breakfast", "Lunch", "Dinner"].map((meal) => (
            <div key={meal} className="grid grid-cols-4 gap-4 mt-2">
              <div className="font-medium">{meal}</div>
              {constants.DAYS.map((day) => {
                const entry = planner[day][meal];
                const recipe = recipes.find((r) => r.id === entry?.recipeId);
                return (
                  <Card key={`${day}-${meal}`}>
                    <CardContent
                      className="p-3 h-24 flex flex-col gap-2 justify-between"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop(day, meal, e)}
                    >
                      {recipe ? (
                        <>
                          <div className="text-sm font-medium line-clamp-2">
                            {recipe.title}
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{entry?.servings} servings</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onClear(day, meal)}
                            >
                              Clear
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full text-sm text-muted-foreground flex items-center justify-center">
                          Drop recipe here
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Planner;
