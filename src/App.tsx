import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recipes from "./pages/Recipes";
import RecipeForm from "./pages/RecipeForm";
import Planner from "./pages/Planner";
import Grocery from "./pages/Grocery";
import RecipeDetail from "./pages/RecipeDetail";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route
                path="/recipes/new"
                element={
                  <ProtectedRoute>
                    <RecipeForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route
                path="/planner"
                element={
                  <ProtectedRoute>
                    <Planner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grocery"
                element={
                  <ProtectedRoute>
                    <Grocery />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
