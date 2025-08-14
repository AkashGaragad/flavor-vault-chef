import { Helmet } from "react-helmet-async";
import hero from "@/assets/hero-food.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChefHat, CalendarDays, ShoppingCart } from "lucide-react";
const navItems = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/planner", label: "Planner" },
  { to: "/grocery", label: "Grocery" },
];
const Index = () => {
  return (
    <main>
      <Helmet>
        <title>Recipe Collection, Meal Planner & Grocery List</title>
        <meta name="description" content="Create, plan, and shop smarter with your personal recipe collection. Meal planner, grocery list generator, and nutrition insights." />
        <link rel="canonical" href="/" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 py-16">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Your Personal Recipe HQ</h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Save your favorite recipes, plan a delicious week, and get a consolidated grocery list automatically. Cook confidently with nutrition at a glance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/recipes/new">Add a Recipe</Link>
              </Button>
              <Button asChild variant="secondary" size="xl">
                <Link to="/planner">Plan My Week</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/auth">Log in</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border shadow-elegant overflow-hidden">
            <img src={hero} alt="Appetizing Mediterranean dish showcasing fresh ingredients" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-6">
              <Link to="/recipes" >
               
            
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center">
                <ChefHat className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Curate Recipes</h3>
              <p className="text-muted-foreground text-sm">Rich recipe entries with photo, ingredients, steps, tags, and difficulty.</p>
            </CardContent>
          </Card>
             
              </Link>
               <Link to="/planner" >
               
            
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Plan Your Week</h3>
              <p className="text-muted-foreground text-sm">Drag-and-drop your meals across the week with portion scaling.</p>
            </CardContent>
          </Card>
            </Link>
               <Link to="/grocery" >
            
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Shop Efficiently</h3>
              <p className="text-muted-foreground text-sm">Automatic consolidated grocery list from your planned meals.</p>
            </CardContent>
          </Card>
             
              </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
