import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "@backtester/ui";

const feedbackSchema = z.object({
  message: z.string().min(10, "Please provide at least 10 characters"),
  rating: z.coerce.number().min(1).max(5).optional(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
    reset();
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Share your feedback</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We use feedback to prioritize roadmap items and smooth out onboarding.
        </p>
      </header>
      <Card>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {submitted ? (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" aria-live="polite">
              Thanks for sending feedback! We read every note.
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="feedback-message">
              How can we improve?
            </label>
            <textarea
              id="feedback-message"
              rows={5}
              {...register("message")}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "feedback-message-error" : undefined}
            />
            {errors.message ? (
              <p id="feedback-message-error" className="mt-2 text-sm text-rose-600" role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="feedback-rating">
              Optional rating (1-5)
            </label>
            <input
              id="feedback-rating"
              type="number"
              min={1}
              max={5}
              {...register("rating")}
              className="mt-1 w-32 rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.rating ? "true" : "false"}
              aria-describedby={errors.rating ? "feedback-rating-error" : undefined}
            />
            {errors.rating ? (
              <p id="feedback-rating-error" className="mt-2 text-sm text-rose-600" role="alert">
                Rating must be between 1 and 5
              </p>
            ) : null}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto">
            Submit feedback
          </Button>
        </form>
      </Card>
    </div>
  );
}
