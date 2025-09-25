"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/button";
import { registerDemoUser } from "../../../lib/demo-auth";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setError("Please complete all fields");
      return;
    }
    registerDemoUser({ name, email, password });
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Create your workspace</h1>
      <p className="mt-2 text-slate-300">Sign up to access the dashboard and backtesting tools.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4" aria-label="Sign up form">
        <label className="block text-sm text-slate-200">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand focus:outline-none"
            placeholder="Ada Lovelace"
            name="name"
          />
        </label>
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
            autoComplete="new-password"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
    </div>
  );
}
