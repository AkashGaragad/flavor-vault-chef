import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, signIn, signUp, resendVerificationEmail, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New state: when true, we show "check your email" UI
  const [verificationSent, setVerificationSent] = useState(false);
  // Track resend cooldown to avoid accidental spam
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      // If user exists and email is verified (provider-specific), redirect:
      // Assumes user.emailVerified or user.confirmed flag is available on user object
      const verified = Boolean((user as any).emailVerified || (user as any).confirmed_at);
      if (verified) navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    // resend cooldown timer (simple countdown)
    if (resendCooldown > 0) {
      const id = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [resendCooldown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) setError(error.message || "Sign-in failed");
        else navigate("/", { replace: true });
      } else {
        // signUp should create account and trigger email verification send
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message || "Sign-up failed");
        } else {
          // Show verification UI and start cooldown
          setVerificationSent(true);
          setResendCooldown(30); // 30s cooldown for example
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await resendVerificationEmail(email);
      if (error) setError(error.message || "Unable to resend verification email.");
      else {
        setResendCooldown(30);
      }
    } catch (err: any) {
      setError(err?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerified = async () => {
    setLoading(true);
    setError(null);
    try {
      // Force refresh user from provider (re-read from server)
      await refreshUser();
      // After refresh, the `user` from useAuth should update and useEffect will redirect if verified
      // But we can also check the value returned by refreshUser if implemented to return the latest user
      const latestUser = (await refreshUser?.()) || (user as any);
      const verified = Boolean(latestUser?.emailVerified || latestUser?.confirmed_at);
      if (!verified) {
        setError("Email not verified yet. Please check your inbox (or Spam) and click the verification link.");
      } else {
        // navigate to intended page
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || "Unable to check verification status.");
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : (verificationSent ? "Verify your email" : "Create your account")}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setVerificationSent(false); // Reset verification UI when toggling
                    setMode(mode === "signin" ? "signup" : "signin");
                  }}
                >
                  {mode === "signin" ? "Need an account?" : "Have an account?"}
                </Button>
              </div>

              {verificationSent ? (
                // Verification UI
                <div className="space-y-4">
                  <p>
                    A verification email has been sent to <strong>{email}</strong>. Please open the email and click the verification link to activate your account.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If you don't see the email, check your spam folder or try resending.
                  </p>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <div className="flex gap-2">
                    <Button onClick={handleResend} disabled={loading || resendCooldown > 0}>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification"}
                    </Button>

                    <Button variant="outline" onClick={handleCheckVerified} disabled={loading}>
                      I verified — check now
                    </Button>
                  </div>

                  <p className="text-sm">
                    Wrong email? <Link to="/auth" onClick={() => { setVerificationSent(false); setMode("signup"); setEmail(""); setPassword(""); }} className="underline">Use a different email</Link>.
                  </p>
                </div>
              ) : (
                // Sign in / sign up form
                <>
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
                      <Label htmlFor="password"> Password</Label>
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
                      {loading ? "Please wait..." : mode === "signin" ? "Log in" : "Create account"}
                    </Button>
                  </form>

                  <p className="text-sm text-muted-foreground">
                    By continuing, you agree to our Terms. Having trouble? <Link to="/" className="underline">Go back home</Link>.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Auth;
