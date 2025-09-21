import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "@backtester/ui";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupForm = z.infer<typeof signupSchema>;

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { id: "number", label: "One number", test: (value: string) => /\d/.test(value) },
  {
    id: "symbol",
    label: "One special character",
    test: (value: string) => /[#?!@$%^&*-]/.test(value),
  },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    watch,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail = body?.detail ?? "Unable to sign up. Please try again.";
        setServerError(typeof detail === "string" ? detail : JSON.stringify(detail));
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to sign up. Please try again.");
    }
  });

  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link className="text-indigo-600" to="/login">Log in</Link>
        </p>
      </header>
      <Card>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {serverError ? (
            <div
              className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
              aria-live="assertive"
            >
              {serverError}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name ? (
              <p id="name-error" className="mt-2 text-sm text-rose-600" role="alert">
                {errors.name.message}
              </p>
            ) : dirtyFields.name ? (
              <p className="mt-2 text-sm text-emerald-600">Looks good!</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="mt-2 text-sm text-rose-600" role="alert">
                {errors.email.message}
              </p>
            ) : dirtyFields.email ? (
              <p className="mt-2 text-sm text-emerald-600">Looks good!</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-help password-error"
            />
            <ul id="password-help" className="mt-3 space-y-1 text-sm" aria-live="polite">
              {passwordRequirements.map((req) => {
                const passed = req.test(passwordValue);
                return (
                  <li key={req.id} className={passed ? "text-emerald-600" : "text-slate-500 dark:text-slate-400"}>
                    {passed ? "✓" : "•"} {req.label}
                  </li>
                );
              })}
            </ul>
            {errors.password ? (
              <p id="password-error" className="mt-2 text-sm text-rose-600" role="alert">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {errors.confirmPassword ? (
              <p id="confirm-password-error" className="mt-2 text-sm text-rose-600" role="alert">
                {errors.confirmPassword.message}
              </p>
            ) : dirtyFields.confirmPassword ? (
              <p className="mt-2 text-sm text-emerald-600">Passwords match</p>
            ) : null}
          </div>

          <Button type="submit" disabled={!isValid || isSubmitting} isLoading={isSubmitting} className="w-full">
            Create account
          </Button>
        </form>
      </Card>
    </div>
  );
}
