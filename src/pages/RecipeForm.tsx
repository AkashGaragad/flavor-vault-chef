import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";  // ✅ use supabase client

function compressImage(file: File, maxWidth = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return reject("Invalid image");
      img.src = reader.result;
    };
    reader.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const difficulties = ["Easy", "Medium", "Hard"] as const;

const RecipeForm = () => {
  const { toast } = useToast();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number>(30);
  const [servings, setServings] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<typeof difficulties[number]>("Easy");
  const [tags, setTags] = useState<string>("");
  const [stepsText, setStepsText] = useState<string>("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const [ingredients, setIngredients] = useState<any[]>([
    { id: crypto.randomUUID?.() || String(Math.random()), name: "", quantity: 0, unit: "g" },
  ]);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    const dataUrl = await compressImage(file);
    setImage(dataUrl);
  };

  const onSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a recipe title.",
        variant: "destructive",
      });
      return;
    }

    const steps = stepsText
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    // ✅ Save to Supabase
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          title: title.trim(),
          description: "", // optional field
          time_minutes: timeMinutes,
          servings,
          difficulty,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          ingredients: ingredients.filter((i) => i.name.trim()),
          steps,
          image,
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Recipe saved",
      description: `${data.title} added successfully.`,
    });
    nav(`/recipe/${data.id}`);
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Add Recipe | Personal Recipe Collection</title>
        <meta
          name="description"
          content="Create a new recipe with photo, ingredients, and step-by-step instructions."
        />
        <link rel="canonical" href="/recipes/new" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Add Recipe</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grilled Salmon"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Time (min)</Label>
                  <Input
                    type="number"
                    value={timeMinutes}
                    onChange={(e) =>
                      setTimeMinutes(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Servings</Label>
                  <Input
                    type="number"
                    value={servings}
                    onChange={(e) =>
                      setServings(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as any)
                    }
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="salmon, zucchini, dinner"
                />
              </div>

              <div className="space-y-2">
                <Label>Steps (one per line)</Label>
                <Textarea
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  rows={8}
                  placeholder="Write each cooking step on a new line..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Photo</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  {image && (
                    <img
                      src={image}
                      alt="Recipe preview"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ingredients</Label>
                <div className="space-y-3">
                  {ingredients.map((i, idx) => (
                    <div key={i.id} className="grid grid-cols-12 gap-2">
                      <Input
                        className="col-span-5"
                        placeholder="Name"
                        value={i.name}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((x, xIdx) =>
                              xIdx === idx
                                ? { ...x, name: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                      <Input
                        className="col-span-3"
                        type="number"
                        step="0.01"
                        placeholder="Qty"
                        value={i.quantity}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((x, xIdx) =>
                              xIdx === idx
                                ? {
                                    ...x,
                                    quantity:
                                      parseFloat(e.target.value) || 0,
                                  }
                                : x
                            )
                          )
                        }
                      />
                      <Input
                        className="col-span-4"
                        placeholder="Unit (g, ml, piece)"
                        value={i.unit}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((x, xIdx) =>
                              xIdx === idx
                                ? { ...x, unit: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setIngredients((p) => [
                          ...p,
                          {
                            id:
                              crypto.randomUUID?.() ||
                              String(Math.random()),
                            name: "",
                            quantity: 0,
                            unit: "g",
                          },
                        ])
                      }
                    >
                      Add Ingredient
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setIngredients((p) =>
                          p.length > 1 ? p.slice(0, -1) : p
                        )
                      }
                    >
                      Remove Last
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="hero" onClick={onSubmit}>
              Save Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default RecipeForm;
