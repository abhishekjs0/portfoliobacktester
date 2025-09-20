"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="auth-page">
      <div className="landing-container">
        <div className="auth-card">
          <span className="landing-badge">Create account</span>
          <h1>Join the portfolio backtesting beta</h1>
          <p>Import TradingView CSVs, run multi-symbol backtests and compare strategies without leaving your browser.</p>
          {submitted ? (
            <div className="alert alert--success" role="status">
              Thanks! Check your inbox for a confirmation email with next steps.
            </div>
          ) : (
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label>
                <span>Full name</span>
                <input type="text" name="name" required autoComplete="name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" required autoComplete="email" />
              </label>
              <label>
                <span>Password</span>
                <input type="password" name="password" required minLength={8} />
              </label>
              <label>
                <span>Primary trading focus</span>
                <select name="focus" defaultValue="stocks">
                  <option value="stocks">Equities</option>
                  <option value="forex">Forex</option>
                  <option value="crypto">Crypto</option>
                  <option value="futures">Futures</option>
                </select>
              </label>
              <button type="submit" className="button button--primary">
                Create my account
              </button>
            </form>
          )}
          <p className="auth-switch">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
