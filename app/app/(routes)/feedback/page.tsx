"use client";

import { FormEvent, useState } from "react";
import { Button } from "../../../components/ui/button";
import { submitFeedback } from "../../../lib/api";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    setError(null);
    try {
      await submitFeedback({ message, email: email || undefined });
      setStatus("Thank you for the feedback! We'll review it shortly.");
      setMessage("");
      setEmail("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">We’d love to hear from you</h1>
      <p className="mt-2 text-slate-300">
        Share ideas, report bugs, or suggest improvements. Include your email if you’d like a reply.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-slate-200">
          Feedback
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={5}
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand focus:outline-none"
            placeholder="Tell us what’s working, what’s confusing, or what you need next."
          />
        </label>
        <label className="block text-sm text-slate-200">
          Contact email (optional)
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-brand focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {status && <p className="text-sm text-emerald-300">{status}</p>}
        <Button type="submit" isLoading={isSubmitting} disabled={message.trim().length === 0}>
          Send feedback
        </Button>
      </form>
    </div>
  );
}
