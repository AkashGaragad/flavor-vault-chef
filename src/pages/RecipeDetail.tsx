import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShareButton } from "@/components/ShareButton";
import { computeNutrition, scaleIngredients } from "@/store/recipeStore"; 
import { supabase } from "@/integrations/supabase/client";

const RecipeDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(2);

  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
      } else if (data) {
        setRecipe(data);
        setServings(data.servings || 2);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  const nutrition = useMemo(
    () =>
      recipe
        ? computeNutrition(recipe.ingredients, recipe.servings, servings)
        : { calories: 0, protein: 0, carbs: 0, fat: 0 },
    [recipe, servings]
  );

  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">Loading recipe...</div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div>Recipe not found</div>
          <Button onClick={() => nav("/recipes")}>Back to Recipes</Button>
        </div>
      </main>
    );
  }

  const scaled = scaleIngredients(recipe.ingredients, recipe.servings, servings);

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>{recipe.title} | Personal Recipe Collection</title>
        <meta
          name="description"
          content={`View ${recipe.title} with ingredients, steps, and nutrition.`}
        />
        <link rel="canonical" href={`/recipe/${recipe.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: recipe.title,
            image: recipe.image ? [recipe.image] : undefined,
            recipeYield: `${servings} servings`,
            recipeIngredient: scaled.map(
              (i: any) => `${i.quantity} ${i.unit} ${i.name}`
            ),
            recipeInstructions: recipe.steps.map((s: string) => ({
              "@type": "HowToStep",
              text: s,
            })),
          })}
        </script>
      </Helmet>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
            {recipe.image && (
              <img
                width="600"
                height="400"
                loading="lazy"
                src={recipe.image}
                alt={`${recipe.title} photo`}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">{recipe.title}</h1>
          <p className="text-muted-foreground mt-2">{recipe.description}</p>

          <section className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold">Steps</h2>
            <ol className="list-decimal pl-6 space-y-2">
              {recipe.steps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Servings</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    min={1}
                    className="w-24 h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={servings}
                    onChange={(e) =>
                      setServings(parseInt(e.target.value) || recipe.servings)
                    }
                  />
                </div>
              </div>

                  <div className="space-y-2">
                <h3 className="font-semibold">Ingredients</h3>
                <ul className="space-y-1 text-sm">
                  {scaled.map((i: any) => (
                    <li key={i.id || i.name} className="flex justify-between">
                      <span>{i.name}</span>
                      <span className="text-muted-foreground">
                        {i.quantity} {i.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Nutrition (approx.)</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>Calories: {Math.round(nutrition.calories)}</li>
                  <li>Protein: {nutrition.protein.toFixed(1)} g</li>
                  <li>Carbs: {nutrition.carbs.toFixed(1)} g</li>
                  <li>Fat: {nutrition.fat.toFixed(1)} g</li>
                </ul>
              </div>
                            <div className="flex gap-3">
                <Button variant="hero" onClick={() => nav("/planner")}>
                  Plan this recipe
                </Button>
                <ShareButton />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
};

export default RecipeDetail;
