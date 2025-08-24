import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";  // ✅ supabase client

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

    // ✅ get current logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a recipe.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Save to Supabase with user_id
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          user_id: user.id, // 👈 required for RLS
          title: title.trim(),
          description: "", // optional
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
          {/* your existing form fields remain unchanged */}
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
