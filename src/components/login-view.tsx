"use client";

import { FormEvent, useState } from "react";
import { Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, SessionUser } from "@/lib/client";

export function LoginView({
  onLogin,
  onSignUp,
  firstRun = false,
}: {
  onLogin: (user: SessionUser) => void;
  onSignUp?: () => void;
  firstRun?: boolean;
}) {
  const [email, setEmail] = useState("admin@attitude360.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const user = await apiClient.login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      onLogin(user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";

      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100/40 via-background to-background px-4 py-10">
      <div className="w-full max-w-md">
        {/* HireFlow Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="HireFlow logo"
            className="mb-4 h-16 w-16 drop-shadow-md"
          />

          <h1 className="text-3xl font-bold tracking-tight">
            HireFlow
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Smart Recruitment & Applicant Tracking
          </p>

          <p className="brand-gradient-text mt-2 text-xs font-semibold uppercase tracking-wider">
            Developed by Pratyush Choudhury
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold">
            Sign in to HireFlow
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Access your recruitment workspace to manage jobs,
            candidates, applications, and interviews.
          </p>

          {/* First-run setup notice */}
          {firstRun && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm text-sky-800">
              <UserPlus className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                This instance has no accounts yet.{" "}
                <button
                  type="button"
                  onClick={onSignUp}
                  className="font-semibold underline underline-offset-2"
                >
                  Create your admin account
                </button>{" "}
                to get started.
              </p>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
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
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}

              {busy ? "Signing in…" : "Sign in to HireFlow"}
            </Button>
          </form>

          {/* Signup Navigation */}
          {onSignUp && !firstRun && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </button>
            </div>
          )}

          {/* Local Development Demo Account */}
          <div className="mt-6 flex items-start gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

            <p>
              <span className="font-medium text-foreground">
                Local demo account
              </span>{" "}
              — Email:{" "}
              <code className="rounded bg-background px-1 py-0.5 font-mono">
                admin@attitude360.com
              </code>
              , Password:{" "}
              <code className="rounded bg-background px-1 py-0.5 font-mono">
                admin123
              </code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 space-y-1 text-center">
          <p className="text-xs text-muted-foreground">
            HireFlow · Smart Recruitment & Applicant Tracking
          </p>

          <p className="text-xs text-muted-foreground">
            Developed by Pratyush Choudhury
          </p>
        </footer>
      </div>
    </div>
  );
}