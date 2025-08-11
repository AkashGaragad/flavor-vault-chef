import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { Recipe } from "@/store/recipeStore";

interface Props {
  recipe: Recipe;
  onClick?: () => void;
}

export const RecipeCard = ({ recipe, onClick }: Props) => {
  return (
    <Card onClick={onClick} className="cursor-pointer overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="aspect-video w-full bg-muted overflow-hidden">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={`${recipe.title} recipe photo`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2">{recipe.title}</h3>
          {typeof recipe.rating === "number" && (
            <div className="flex items-center text-muted-foreground">
              <Star className="h-4 w-4 mr-1" /> {recipe.rating.toFixed(1)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{recipe.difficulty}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" /> {recipe.timeMinutes} min
          </div>
        </div>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
