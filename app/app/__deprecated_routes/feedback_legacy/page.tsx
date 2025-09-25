"use client";

import { useState } from "react";

const feedbackAreas = [
  "CSV upload",
  "Portfolio metrics",
  "Comparison workspace",
  "Pricing & plans",
  "Something else",
];

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="auth-page">
      <div className="landing-container">
        <div className="auth-card feedback-card">
          <span className="landing-badge">We’d love your feedback</span>
          <h1>Help us shape the roadmap</h1>
          <p>
            Tell us what’s working, what’s missing and which features would save
            you the most time.
          </p>
          {submitted ? (
            <div className="alert alert--success" role="status">
              Thank you for sharing your thoughts! We’ll be in touch if we have
              follow-up questions.
            </div>
          ) : (
            <form
              className="feedback-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label>
                <span>Your email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>What part of the product are you commenting on?</span>
                <select name="area" defaultValue={feedbackAreas[0]}>
                  {feedbackAreas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>How can we improve?</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Share details, ideas or frustrations"
                />
              </label>
              <label>
                <span>
                  How likely are you to recommend us to a trading friend?
                </span>
                <input
                  type="range"
                  name="nps"
                  min="0"
                  max="10"
                  defaultValue="8"
                />
              </label>
              <button type="submit" className="button button--primary">
                Send feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
