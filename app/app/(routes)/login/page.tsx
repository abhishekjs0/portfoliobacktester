"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../components/ui/button";
import { authenticateDemoUser } from "../../../lib/demo-auth";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = authenticateDemoUser(email, password);
      router.push(`/dashboard?welcome=${encodeURIComponent(user.name)}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Log in</h1>
      <p className="mt-2 text-slate-300">Welcome back. Use the credentials from signup.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4" aria-label="Login form">
        <label className="block text-sm text-slate-200">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand focus:outline-none"
            placeholder="you@example.com"
            name="email"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand focus:outline-none"
            placeholder="••••••••"
            name="password"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-300">Loading login…</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
