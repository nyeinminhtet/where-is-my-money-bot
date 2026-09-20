# Developer Instructions

These instructions describe how to set up, configure, and deploy `where-is-my-money-bot`.

## Repository Rules

- Use TypeScript with **ES6 arrow functions** for all application code.
- Enforce clean, modular code: **No component file should exceed 200 lines of code**.
- Move all helper, transformation, and utility functions out of components and place them into `lib/helpers/` or `utils/`.
- Use **Bun** (`bun`) as the primary package manager for installation and running scripts.
- Keep the project aligned with the Next.js App Router.
- Build Telegram webhook logic as latency-sensitive serverless route handlers only.
- Client-side data fetching must use `@tanstack/react-query`.
- Organize frontend code into domain-specific feature folders under `features/` with kebab-case filenames.
- Place all app code in `app/`.
- Do not edit generated assets directly.
- Do not leave placeholder code, fake data, or temporary stubs in committed files.
- Preserve Myanmar text exactly and save files as UTF-8.

## 1. Install Dependencies

Use **Bun** to install required project dependencies:

```bash
bun install
```

If @tanstack/react-query, recharts, or lucide-react are not yet installed in your environment, add them:

```bash
bun add @tanstack/react-query recharts lucide-react
```

If Prisma is not yet installed, add it before generating the client:

```bash
bun add prisma @prisma/client
```

## 2. Environment Variables

Copy `.env.example` to `.env` at the project root and fill in your values:

```bash
cp .env.example .env
```

Define (at minimum):

- `DATABASE_URL` - Use the Supabase pooler URL for runtime database access.
- `DIRECT_URL` - Use the direct PostgreSQL URL for Prisma migrations.
- `NEXT_PUBLIC_SITE_URL` - The public site URL used as `metadataBase` / Mini App link.
- `TELEGRAM_BOT_TOKEN` - The token issued by @BotFather.
- `TELEGRAM_WEBHOOK_SECRET` - Secret token for Telegram webhook request verification.
- `GEMINI_API_KEY` - The Google AI Studio / Gemini API key used for text and multimodal parsing.
- `GEMINI_MODEL` - Optional Gemini model override (defaults to `gemini-3.1-flash-lite`).
- `ADMIN_TELEGRAM_ID` - Telegram user id granted unlimited AI quota (admin).
- `CRON_SECRET` - Shared secret used to authorize the daily reminder cron route.

## 3. Supabase Connection Pooling

This bot should use the Supabase pooler endpoint in production because serverless functions must not exhaust database connections.

Recommended configuration:

1. Copy the Supabase pooled connection string.
2. Put it in `DATABASE_URL`.
3. Keep the direct PostgreSQL string in `DIRECT_URL`.
4. Use `DIRECT_URL` for Prisma migrations and `DATABASE_URL` for runtime queries.

Example Prisma datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 4. Telegram Bot Token Setup

1. Open Telegram and message @BotFather.
2. Create a new bot.
3. Copy the bot token from BotFather.
4. Save the token in `TELEGRAM_BOT_TOKEN`.
5. Keep the bot name and username consistent with the project identity.

## 5. Local Development

Run the app locally with Bun:

```bash
bun dev
```

If Prisma schema changes occur, generate the client and apply migrations:

```bash
bun prisma generate
bun prisma migrate dev
```

## 6. Frontend Architecture and Clean Code Structure

- **Provider Setup:** Wrap `app/layout.tsx` with `<Providers>` initializing `@tanstack/react-query`.

- **Helpers and Utilities (`lib/helpers/`, `utils/`):**
  - Extract date formatters, time-based greeting logic, calculation utilities, and digit converters into `lib/helpers/` or `utils/`.

- **Feature-Based Architecture (`features/`):**
  Frontend components are organized into domain-specific feature folders with flat structure and kebab-case filenames:

  ```
  features/
  ├── transactions/    # TransactionList, CreateTransactionModal, TransactionEditModal, use-transactions hook, transaction schema
  ├── analytics/       # AnalyticsView, EmptyAnalytics
  ├── budget/          # MonthlyBudgetCard
  └── dashboard/       # Header, MonthSelector, SummaryCards, ViewTabs
  ```

  - Each feature file is single-purpose and under 200 lines.
  - Import feature components in `page.tsx` using `@/features/*` aliases.
  - No nested `components/` sub-folders inside features.

- **Kebab-Case Naming:** All component files, hooks, schemas, and utilities use kebab-case filenames (e.g., `transaction-list.tsx`, `use-transactions.ts`, `format-currency.ts`).

## 7. Vercel Deployment

1. Push the repository to your Git provider.
2. Import the project into Vercel.
3. Configure the production environment variables.
4. Deploy the project.
5. Confirm the live Vercel domain.

## Telegram Webhook URL

Set the Telegram webhook to the live HTTPS endpoint for the deployed app. The exact path is `/api/telegram` on the production domain assigned by Vercel.

### setWebhook Command

Call Telegram `setWebhook` with the bot token, the webhook URL, and a `secret_token` for request verification. The `secret_token` must match `TELEGRAM_WEBHOOK_SECRET` in your environment.

```bash
curl -F "url=https://<your-domain>/api/telegram" \
  -F "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
  "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook"
```

## 8. Operational Checks

- Verify /start responds in Myanmar language.
- Verify Myanmar digits such as are parsed correctly.
- Verify /balance and /report return chat-specific data.
- Verify /monthly and /yearly return aggregated table-style summaries.
- Verify Web Mini App filters transactions dynamically when toggling months/years.
- Ensure all component files adhere to the ES6 arrow function syntax and stay strictly under 200 lines of code.
- Verify webhook handlers return quickly enough for serverless execution.
