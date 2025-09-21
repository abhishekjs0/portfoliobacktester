"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div className="auth-page">
      <div className="landing-container">
        <div className="auth-card">
          <span className="landing-badge">Welcome back</span>
          <h1>Log in to continue your research</h1>
          <p>
            Access saved backtests, compare strategies and manage your
            subscription.
          </p>
          {success ? (
            <div className="alert alert--success" role="status">
              You are logged in. Redirecting to dashboard…
            </div>
          ) : (
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                if (!formData.get("email") || !formData.get("password")) {
                  setError("Email and password are required.");
                  return;
                }
                setError(null);
                setSuccess(true);
              }}
            >
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                <span>Password</span>
                <input type="password" name="password" required minLength={8} />
              </label>
              {error && (
                <div className="alert alert--error" role="alert">
                  {error}
                </div>
              )}
              <button type="submit" className="button button--primary">
                Log in
              </button>
            </form>
          )}
          <p className="auth-switch">
            New here? <Link href="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
