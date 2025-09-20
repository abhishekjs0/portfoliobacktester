# Multi-Symbol Portfolio Backtesting SaaS: Full Lifecycle Plan

## 1. Discovery and Scoping

### Problem: TradingView's Single-Symbol Limitation
TradingView's Strategy Tester only evaluates one symbol per run. Power users must manually run Pine scripts symbol-by-symbol, export CSVs, and consolidate results in spreadsheets or custom scripts. This process is slow and error-prone, leaving traders without reliable portfolio-level analytics despite the existence of community-built workarounds that are difficult to maintain and limited in scope.

### Target Personas and Motivations
- **Retail Quant Hobbyist** – Tech-savvy hobbyist who wants multi-symbol validation without heavy coding.
- **Prop Challenge Trader** – Active trader managing diversified portfolios for prop firm evaluations.
- **Pine Script Developer** – Experienced Pine engineer needing scale and credibility for commercial strategies.

### Core Jobs to Be Done
- **Batch Backtesting**: Run the same strategy across dozens of symbols and years of data in a single job.
- **Portfolio Simulation**: Produce consolidated equity curves and risk metrics for strategy portfolios.
- **Rapid Iteration**: Re-run portfolio tests instantly after parameter tweaks.
- **Cross-Strategy Comparison**: Benchmark multiple strategies across identical symbol sets.

### Emotional Jobs
Confidence in deployment, significant time savings, professionalism, and risk mitigation through deeper test coverage.

### MVP Scope
**In Scope:** CSV ingestion from TradingView exports, aggregated performance metrics, equity curve visualization, multi-strategy imports, authenticated dashboard, configurable allocation assumptions, and basic comparisons.

**Out of Scope:** Native Pine execution, live trading, strategy editors, advanced portfolio analytics (e.g., walk-forward, Monte Carlo), tick-level intraday processing, and bundled market data feeds.

### Assumptions and Risks
- **Data Availability:** Relies on user-exported TradingView CSVs; potential ToS ambiguity.
- **User Trust:** Requires strong security posture to overcome fear of strategy leakage.
- **Accuracy Expectations:** Aggregation math must be bulletproof to retain credibility.
- **Performance and Cost:** Need efficient compute for large jobs without inflating infrastructure spend.
- **User Inertia:** Product must dramatically improve UX versus spreadsheets and alternative platforms.
- **Competitive Response:** TradingView or rivals may close the gap; speed to market and UX differentiation are critical.

### 12-Week MVP Roadmap
1. **Week 1 – Foundations:** Finalize specs, design schema, bootstrap repos, CI, and skeleton services.
2. **Week 2 – Design Sprint:** Produce wireframes, test with early users, iterate UX direction.
3. **Week 3 – Frontend Kickoff:** Build marketing site shell, auth screens, and isolated CSV upload prototype.
4. **Week 4 – Backend Core:** Implement CSV parsing, trade aggregation, and metric computation end-to-end locally.
5. **Week 5 – Dashboard UI:** Deliver authenticated dashboard with equity chart, metric cards, and trade table.
6. **Week 6 – Alpha Testing:** Invite early adopters, gather feedback, resolve parsing/calculation bugs.
7. **Week 7 – Hardening:** Address auth edge cases, validation, error states, and performance optimizations.
8. **Week 8 – UX Enhancements:** Add comparison tools, demo data mode, and pricing awareness elements.
9. **Week 9 – Marketing Prep:** Finalize homepage copy, pricing layout, analytics tracking.
10. **Week 10 – Payments & Beta Dry Run:** Integrate Stripe, execute full workflow test on staging.
11. **Week 11 – QA & Release Candidate:** Comprehensive testing, bug bash, deploy v0.1 behind invites.
12. **Week 12 – Beta Release:** Expand beta cohort, monitor telemetry, collect testimonials, prep for GA.

### Success Metrics
- **Qualitative:** User delight quotes, perceived accuracy, organic referrals.
- **Quantitative:** >50% Day-1/Week-1 retention, 5+ backtests per active user, >95% successful job completion, 5–10% free-to-paid conversion, 500+ MAU post-launch, NPS > 50.

## 2. Information Architecture & UX Flows

### Route Structure (JSON Sitemap)
```json
{
  "publicRoutes": ["/", "/features", "/pricing", "/signup", "/login"],
  "authRoutes": ["/dashboard", "/backtests", "/strategy/:id", "/upload", "/feedback", "/roadmap"]
}
```

### Primary UX Flows
1. **Onboarding → Import CSV → Run Backtest → View Results**
   - Sign up, land on empty dashboard with upload CTA.
   - Launch upload modal, drop multiple TradingView CSVs, validate client-side.
   - Submit files, track processing status, transition to results view.
   - Review equity chart, key metric cards, combined trade table; proceed to iterate or compare.

2. **Strategy Comparison Across Symbols**
   - From backtests list, select multiple runs.
   - Open comparison view with overlaid equity curves and side-by-side metrics.
   - Toggle metrics, derive insights, return to dashboard or duplicate tests.

3. **Subscription Upgrade Flow**
   - Access pricing page or in-app prompt, choose plan.
   - Redirect through Stripe Checkout, confirm payment.
   - Return to dashboard with upgraded entitlements and billing management options.

Consistent navigation (sidebar + top nav), accessible components, and responsive layouts underpin each flow.

## 3. Content Strategy & Conversion Copy

### Hero Messaging
- **Headline:** “Backtest Entire Portfolios in One Click – Finally, a strategy tester for TradingView power-users.”
- **Subheadline:** “Tired of running your strategy one symbol at a time? Our cloud platform crunches 20+ symbols in seconds, so you can find the edge in your portfolio and act now – no coding or waiting required.”

### Key Benefits
1. Save hours every week through automation of CSV aggregation.
2. Boost strategy confidence with multi-market validation insights.
3. Enjoy a no-code experience tailored for TradingView workflows.
4. Access institutional-grade metrics and visualizations instantly.

### Calls to Action
- **Primary:** “Try on Demo Data” – immediate preview without signup.
- **Secondary:** “Upload Your First CSV” – direct path to core value.

### FAQ Highlights
Addresses questions on Pine Script requirements, coding prerequisites, data security, competitive differentiation, pricing tiers, and performance expectations.

## 4. Visual Design System

### Design Tokens (tokens.css)
```css
:root {
  --color-primary: #3B82F6;
  --color-primary-dark: #1E40AF;
  --color-neutral-900: #111111;
  --color-neutral-100: #F3F4F6;
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-danger:  #DC2626;

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 16px;
  --spacing-4: 32px;
  --spacing-5: 64px;

  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.2rem;
  --font-size-xl: 1.44rem;
  --font-size-2xl: 1.728rem;
  --font-size-3xl: 2.074rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.15);

  --transition-default: 0.3s ease-in-out;
  --transition-fast: 0.2s ease-in-out;
}
```

### Base Typography
```css
body {
  font-size: var(--font-size-base);
  color: var(--color-neutral-900);
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  background: #FFFFFF;
}
```

### Component Primitives (BEM Naming)
```css
.button { /* base styles */ }
.button--primary { background: var(--color-primary); color: #FFFFFF; }
.button--outline { background: transparent; border: 2px solid var(--color-primary); }

.tag { border-radius: var(--radius-full); padding: var(--spacing-1) var(--spacing-2); }
.tag--success { background: var(--color-success); color: #fff; }

.alert { padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-sm); }
.alert--success { background: var(--color-success); color: #fff; }

.card { background: #FFFFFF; border: 1px solid var(--color-neutral-100); border-radius: var(--radius-md); }
.card__header { font-size: var(--font-size-lg); font-weight: 600; }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; }
.modal__dialog { max-width: 500px; background: #FFFFFF; border-radius: var(--radius-md); }
```

These tokens and primitives ensure accessible contrast, consistent spacing, modern typography, and modular component composition across the product. They also enable future theming (e.g., dark mode) via variable overrides.
