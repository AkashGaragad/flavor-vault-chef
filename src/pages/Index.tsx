import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import StylishSingleCarousel from "../components/StylishSingleCarousel";

const items = [
  { image: "https://media.istockphoto.com/id/1472680285/photo/healthy-meal-with-grilled-chicken-rice-salad-and-vegetables-served-by-woman.jpg?s=612x612&w=0&k=20&c=E4Y94oLIj8lXYk0OovBhsah3s_sC--WF95xPDvbJPlU=", title: "Check Food Calories", subtitle: "Nutrition at a glance" },
  { image: "https://media.istockphoto.com/id/1472680285/photo/healthy-meal-with-grilled-chicken-rice-salad-and-vegetables-served-by-woman.jpg?s=612x612&w=0&k=20&c=E4Y94oLIj8lXYk0OovBhsah3s_sC--WF95xPDvbJPlU=", title: "Check Food Calories", subtitle: "Nutrition at a glance" },
  { image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHg1LRvpFsjmpdw8dWUaxCnMNL8Pv7H53pYg&s", title: "Curate Recipes", subtitle: "Save & share your favorites" },
  
  { image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL5VQQ8ch63D8W9xzNymhwPnOyjnI8npjXWA&s", title: "Curate Recipes", subtitle: "Save & share your favorites" },
  
];

import {
  ChefHat,
  CalendarDays,
  ShoppingCart,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const navItems = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/planner", label: "Planner" },
  { to: "/grocery", label: "Grocery" },
];
const Index = () => {
  const { user, signOut } = useAuth();
  return (
    <main>
      <Helmet>
        <title>Recipe Collection, Meal Planner & Grocery List</title>
        <meta
          name="description"
          content="Create, plan, and shop smarter with your personal recipe collection. Meal planner, grocery list generator, and nutrition insights."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 py-16">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Your Personal Recipe HQ
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Save your favorite recipes, plan a delicious week, and get a
              consolidated grocery list automatically. Cook confidently with
              nutrition at a glance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="xl">
                <Link to="/recipes/new">Add a Recipe</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/planner">Plan My Week</Link>
              </Button>

              {!user ? (
                <Button asChild variant="outline" size="xl">
                  <Link to="/auth" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              )}
            </div>
          </div>
        <div >
          <StylishSingleCarousel
            items={items}
            autoplay={true}
            interval={4}
            heightClass="h-64 md:h-96"
            showArrows={true}
            showDots={true}
          />
        </div>
         
       

         
      

        </div>
      </section>

      <section className="container mx-auto py-12">
  <div className="grid md:grid-cols-3 gap-6">
    {/* Calorie Checker */}
    <Link to="/CalAI">
      <Card className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30">
        <CardContent className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <ChefHat className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
            Check Food Calories
          </h3>
          <p className="text-muted-foreground text-sm">
            Rich recipe entries with photo, Get nutrition.
          </p>
        </CardContent>
      </Card>
    </Link>

    {/* Curate Recipes */}
    <Link to="/recipes">
      <Card className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30">
        <CardContent className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <ChefHat className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
            Curate Recipes
          </h3>
          <p className="text-muted-foreground text-sm">
            Rich recipe entries with photo, ingredients, steps, tags, and difficulty.
          </p>
        </CardContent>
      </Card>
    </Link>

    {/* Weekly Planner */}
    <Link to="/planner">
      <Card className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30">
        <CardContent className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
            Plan Your Week
          </h3>
          <p className="text-muted-foreground text-sm">
            Drag-and-drop your meals across the week with portion scaling.
          </p>
        </CardContent>
      </Card>
    </Link>

    {/* Grocery Planner */}
    <Link to="/grocery">
      <Card className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30">
        <CardContent className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
            Shop Efficiently
          </h3>
          <p className="text-muted-foreground text-sm">
            Automatic consolidated grocery list from your planned meals.
          </p>
        </CardContent>
      </Card>
    </Link>
  </div>
</section>

    </main>
  );
};

export default Index;
