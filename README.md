# SAKUPUAN (Next.js)

Conversion of the Vite + TSX prototype to **Next.js 16 (App Router) in plain JSX**, with the components split out,
real routes instead of the `currentStep` state machine, and API routes for everything that needs a server.

## Run

```bash
npm install
cp .env.example .env.local   # or use the .env.local that is already here
npm run dev                  # http://localhost:3000
```

With `DEMO_MODE=true` you can open `/dashboard` directly (acts as the demo user "Vivin").
Demo login: `vivin@email.com` / `demo1234`. Registering a new account works too.

## Old step -> new route

| Old `currentStep` | Route | Main component |
|---|---|---|
| landing | `/` | `app/components/landing/LandingPage.jsx` |
| auth | `/auth` | `components/auth/AuthPage.jsx` |
| assessment-1..5 | `/assessment/1` .. `/assessment/5` | `components/assessment/*` |
| review | `/review` | `components/review/ScoreReview.jsx` |
| dashboard | `/dashboard` | `components/dashboard/Dashboard.jsx` |
| insight | `/insight` | `components/insight/FinancialInsight.jsx` |
| prediksi | `/forecast` | `components/forecast/Forecast.jsx` |
| rekomendasi | `/recommendation` | `components/recommendation/RecsQueue.jsx` |
| (chat, was unreachable) | `/recommendation/chat?q=...` | `components/recommendation/Recommendation.jsx` |
| action-plan | `/action-plan` | `components/action-plan/ActionPlan.jsx` |
| telegram-connect | `/telegram` | `components/telegram/TelegramConnect.jsx` |

Route groups: `(landing)` = public page, `(main)` = pages wrapped by `AppShell` (header, nav, profile, AI advisor button, footer).
Shared state (user, assessment answers, score, tasks) lives in `components/providers/AppProvider.jsx` (`useApp()`).

## API routes (`app/api`)

| Method + path | Used by | Notes |
|---|---|---|
| `GET /api/health` | uptime | |
| `POST /api/auth/register` | AuthForm | name, email, password (min 8) -> session cookie |
| `POST /api/auth/login` | AuthForm | |
| `POST /api/auth/logout` | (no UI yet) | |
| `GET /api/auth/me` | AppProvider | `{user: null}` when logged out |
| `GET/PATCH /api/profile` | ProfileModal | same validation as before, now also server-side |
| `GET/POST /api/assessment` | assessment steps, AppProvider | server recomputes the score and saves answers |
| `GET/POST /api/transactions` | Insight page | periods are derived from the data |
| `GET /api/forecast/balance` | Forecast | TODO: compute from real transactions / ML model |
| `GET /api/forecast/prices?commodity=&city=` | Forecast | returns `source: "simulated" \| "sp2kp"` |
| `GET /api/recommendations?city=` | RecsQueue | |
| `POST /api/recommendations/generate` | RecsQueue | calls `AI_SERVICE_URL/recommendations`, falls back to the built-in pool |
| `PATCH /api/recommendations/[id]` | RecsQueue | `skip` / `undo` (approve = `POST /api/tasks`) |
| `GET/POST /api/tasks` | Action Plan | POST is idempotent on title |
| `PATCH/DELETE /api/tasks/[id]` | Action Plan | |
| `POST /api/advisor/chat` | AI Advisor, chat page | calls `AI_SERVICE_URL/chat`, falls back to `lib/advisor.js` |
| `POST /api/telegram/link` | `/telegram` | one-time deeplink `t.me/<bot>?start=<token>` |
| `GET /api/telegram/status` | `/telegram` | page polls until the bot confirms |
| `POST /api/telegram/webhook` | Telegram | `/start <token>`, `/ringkasan`, free text like "Beli beras 75rb" |
| `GET /api/cron/prices` | Vercel Cron | stores SP2KP prices; plug your scraper into `lib/sp2kp.js` |

AI service contract (`lib/aiService.js`): `POST /chat {message, city, userName} -> {reply, suggestion?}` and
`POST /recommendations {city, count, userName} -> {recs: [...]}`. Leave `AI_SERVICE_URL` empty to use the rule-based fallback.

Telegram setup (once): `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<APP_URL>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`

## Environment variables

See `.env.example`. Required in production: `SESSION_SECRET`, `DEMO_MODE=false`, `DATABASE_URL` (once `lib/db.js` is replaced).
`TELEGRAM_*`, `AI_SERVICE_*` and `CRON_SECRET` are only needed for those features.

## Before deploying to Vercel

`lib/db.js` is an **in-memory stub**. Serverless instances do not share memory and restart often, so accounts,
tasks and transactions will disappear. Every route only talks to `db.*` (all async), so replace that single file with
Postgres/Supabase/Prisma. Same for `lib/rateLimit.js` (use Redis/Upstash).

## What changed besides the file split

- **Bug fixed:** `Halo ${name}` / `Skor Awal ${name}` used the global `window.name` (empty string, and a crash during SSR). Now uses `user.name`.
- **Bug fixed:** Landing read `window.innerWidth` during render (breaks SSR). Removed (the value was unused).
- Login form is now real (email + password, controlled inputs). Label changed from "Email / No. WhatsApp" to "Alamat Email".
- Telegram connect no longer marks the account as connected just because the link was clicked; it uses the deeplink flow above.
- Score logic moved to `lib/scoring.js`; `pillarStatus` is a separate export (a function can't be returned from an API).
- Dead code removed: `RadarChart`, Landing `datasets`/commodity picker, OTP/Telegram simulator state, salary-allocation modal (nothing opened them).
- Landing "Panduan format pesan" modal existed but nothing opened it; added a small link under the Telegram demo.
- The chat page (`Recommendation`) was unreachable because `RecsQueue` never called `onAsk`; it now lives at `/recommendation/chat`.
- `showScenario` in Forecast is never toggled in the original; kept as is.
- Fonts via `next/font` (Inter) instead of a CSS `@import`; Tailwind v4 via `@tailwindcss/postcss`.

## Not verified here

I could not run `npm install` / `next build` in my sandbox (no network). What I did verify: all 20 API handlers
(auth cookie flow, validation, tasks, recs, Telegram parsing, forecast maths) with a Node smoke test, every
component server-rendered without errors, and all files parsed/checked for undefined identifiers. Expect to fix small
things on first `next build`.

## Structure

```
  app/(landing)/page.jsx
  app/(main)/action-plan/page.jsx
  app/(main)/assessment/[step]/page.jsx
  app/(main)/assessment/page.jsx
  app/(main)/auth/page.jsx
  app/(main)/dashboard/page.jsx
  app/(main)/forecast/page.jsx
  app/(main)/insight/page.jsx
  app/(main)/layout.jsx
  app/(main)/recommendation/chat/page.jsx
  app/(main)/recommendation/page.jsx
  app/(main)/review/page.jsx
  app/(main)/telegram/page.jsx
  app/api/advisor/chat/route.js
  app/api/assessment/route.js
  app/api/auth/login/route.js
  app/api/auth/logout/route.js
  app/api/auth/me/route.js
  app/api/auth/register/route.js
  app/api/cron/prices/route.js
  app/api/forecast/balance/route.js
  app/api/forecast/prices/route.js
  app/api/health/route.js
  app/api/profile/route.js
  app/api/recommendations/[id]/route.js
  app/api/recommendations/generate/route.js
  app/api/recommendations/route.js
  app/api/tasks/[id]/route.js
  app/api/tasks/route.js
  app/api/telegram/link/route.js
  app/api/telegram/status/route.js
  app/api/telegram/webhook/route.js
  app/api/transactions/route.js
  app/components/action-plan/ActionPlan.jsx
  app/components/action-plan/EditTaskModal.jsx
  app/components/advisor/AIAdvisor.jsx
  app/components/advisor/AdvisorToggle.jsx
  app/components/assessment/AssessmentStep.jsx
  app/components/assessment/PillarStep.jsx
  app/components/assessment/Step1Profile.jsx
  app/components/assessment/parts.jsx
  app/components/auth/AuthForm.jsx
  app/components/auth/AuthPage.jsx
  app/components/dashboard/Dashboard.jsx
  app/components/dashboard/TelegramPrompt.jsx
  app/components/forecast/Forecast.jsx
  app/components/insight/FinancialInsight.jsx
  app/components/landing/CtaBanner.jsx
  app/components/landing/Features.jsx
  app/components/landing/GuideModal.jsx
  app/components/landing/Hero.jsx
  app/components/landing/HowItWorks.jsx
  app/components/landing/LandingFooter.jsx
  app/components/landing/LandingHeader.jsx
  app/components/landing/LandingPage.jsx
  app/components/landing/TelegramSection.jsx
  app/components/landing/primitives.jsx
  app/components/layout/AppShell.jsx
  app/components/profile/ProfileModal.jsx
  app/components/providers/AppProvider.jsx
  app/components/recommendation/Recommendation.jsx
  app/components/recommendation/RecsQueue.jsx
  app/components/review/ScoreReview.jsx
  app/components/telegram/TelegramConnect.jsx
  app/components/ui/Icons.jsx
  app/components/ui/Logo.jsx
  app/components/ui/Modal.jsx
  app/components/ui/Svg.jsx
  app/globals.css
  app/layout.jsx
  app/not-found.jsx
  lib/advisor.js
  lib/aiService.js
  lib/api.js
  lib/assessment.js
  lib/auth.js
  lib/categories.js
  lib/constants.js
  lib/data/recommendations.js
  lib/data/seed.js
  lib/db.js
  lib/env.js
  lib/forecast.js
  lib/format.js
  lib/http.js
  lib/password.js
  lib/periods.js
  lib/rateLimit.js
  lib/recommendations.js
  lib/scoring.js
  lib/session.js
  lib/sp2kp.js
  lib/telegram.js
  lib/useFetch.js
```
Other files: `package.json`, `jsconfig.json` (`@/*` alias), `next.config.mjs`, `postcss.config.mjs`, `vercel.json` (cron), `.env.example`, `.env.local`.
