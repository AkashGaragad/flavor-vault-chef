// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  // newly added:
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // set up listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: (error as unknown as Error) ?? null };
    } catch (err: any) {
      return { error: err ?? new Error("Sign in failed") };
    }
  };

  const signUp: AuthContextValue["signUp"] = async (email, password) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      return { error: (error as unknown as Error) ?? null };
    } catch (err: any) {
      return { error: err ?? new Error("Sign up failed") };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  /**
   * resendVerificationEmail
   *
   * - Client-side: call your server endpoint which uses Supabase Admin (service role) to resend verification.
   * - We return a friendly error object so your UI can show messages.
   */
  const resendVerificationEmail: AuthContextValue["resendVerificationEmail"] = async (email) => {
    try {
      // Call your server endpoint (see server examples below)
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { error: new Error(data?.message || "Failed to resend verification email.") };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err ?? new Error("Network error while resending verification.") };
    }
  };

  /**
   * refreshUser
   *
   * Force fetch the latest user from Supabase and update local state.
   */
  const refreshUser: AuthContextValue["refreshUser"] = async () => {
    try {
      // getUser returns the current logged-in user
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.warn("refreshUser getUser error:", error);
        return null;
      }
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("refreshUser error:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
