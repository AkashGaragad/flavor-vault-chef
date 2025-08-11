import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/recipes/RecipeCard";
import { getRecipes, Recipe } from "@/store/recipeStore";

const Recipes = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes());

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return recipes;
    return recipes.filter((r) =>
      [
        r.title,
        r.description ?? "",
        ...(r.tags ?? []),
        ...(r.ingredients?.map((i) => i.name) ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [q, recipes]);

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Recipes | Personal Recipe Collection</title>
        <meta name="description" content="Browse, search, and manage your personal recipes by ingredients, tags, and cuisine." />
        <link rel="canonical" href="/recipes" />
      </Helmet>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button asChild variant="hero">
          <Link to="/recipes/new">Add Recipe</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-3 items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, ingredient, or tag"
            aria-label="Search recipes"
          />
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <RecipeCard key={r.id} recipe={r} onClick={() => navigate(`/recipe/${r.id}`)} />
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground mt-12">No recipes found. Try a different search.</div>
      )}
    </main>
  );
};

export default Recipes;
