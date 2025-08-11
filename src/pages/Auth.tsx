import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const action = mode === "signin" ? signIn : signUp;
    const { error } = await action(email, password);
    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } else if (mode === "signin") {
      navigate("/", { replace: true });
    } else {
      // For sign up, user might need to confirm email depending on project settings
      navigate("/", { replace: true });
    }

    setLoading(false);
  };

  return (
    <main>
      <Helmet>
        <title>Login or Sign Up | Flavor Vault Chef</title>
        <meta name="description" content="Login or create an account to save recipes, plan meals, and generate grocery lists with Flavor Vault Chef." />
        <link rel="canonical" href="/auth" />
      </Helmet>

      <section className="container mx-auto py-16 max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                >
                  {mode === "signin" ? "Need an account?" : "Have an account?"}
                </Button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : mode === "signin" ? "Log in" : "Sign up"}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our Terms. Having trouble? <Link to="/" className="underline">Go back home</Link>.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Auth;
