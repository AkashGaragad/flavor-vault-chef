import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChefHat, CalendarDays, ShoppingCart, PlusCircle, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const navItems = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/planner", label: "Planner" },
  { to: "/grocery", label: "Grocery" },

];

export const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elegant">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="font-semibold">My Recipes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors",
                  isActive || location.pathname === item.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2  hidden sm:block">
          <Button asChild variant="secondary" size="sm" className="mr-4">
            <Link to="/planner" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Plan Week
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="mr-4">
            <Link to="/CalAI" className="flex items-center gap-2">
            
              Check Calaries
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/recipes/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Recipe
            </Link>
          </Button>
        
        </div>
          {!user ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          )}
      </div>
    </header>
  );
};

export default Header;
