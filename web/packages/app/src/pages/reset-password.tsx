import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "@backtester/ui";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => undefined);
    setSubmitted(true);
  });

  return (
    <div className="mx-auto max-w-md">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Remembered it? <Link className="text-indigo-600" to="/login">Return to login</Link>
        </p>
      </header>
      <Card>
        {submitted ? (
          <div className="space-y-4 p-4 text-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Check your email</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              If an account exists for that email, you will receive a reset link shortly.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="reset-email">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "reset-email-error" : undefined}
              />
              {errors.email ? (
                <p id="reset-email-error" className="mt-2 text-sm text-rose-600" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Send reset link
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
