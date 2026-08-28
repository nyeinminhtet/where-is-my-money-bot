# Developer Instructions

These instructions describe how to set up, configure, and deploy `where-is-my-money-bot`.

## Repository Rules

- Use TypeScript with **ES6 arrow functions** for all application code.
- Enforce clean, modular code: **No component file should exceed 200 lines of code**.
- Move all helper, transformation, and utility functions out of components and place them into `lib/helpers/` or `lib/utils/`.
- Use **Bun** (`bun`) as the primary package manager for installation and running scripts.
- Keep the project aligned with the Next.js App Router.
- Build Telegram webhook logic as latency-sensitive serverless route handlers only.
- Client-side data fetching must use `@tanstack/react-query`.
- Keep components modular under `app/dashboard/components/` and avoid heavy page files.
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

2. Environment Variables

   Copy `.env.example` to `.env` at the project root and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Define (at minimum):
   - DATABASE_URL
   - DIRECT_URL
   - NEXT_PUBLIC_SITE_URL
   - TELEGRAM_BOT_TOKEN
   - GEMINI_API_KEY
   - CRON_SECRET

   Variable Purpose
   - DATABASE_URL
     - Use the Supabase pooler URL for runtime database access.

   - DIRECT_URL
     - Use the direct PostgreSQL URL for Prisma migrations.

   - NEXT_PUBLIC_SITE_URL
     - The public site URL used as `metadataBase` / Mini App link.

   - TELEGRAM_BOT_TOKEN
     - The token issued by @BotFather.

   - GEMINI_API_KEY
     - The Google AI Studio / Gemini API key used for text and multimodal parsing.

   - GEMINI_MODEL
     - Optional Gemini model override (defaults to `gemini-3.1-flash-lite`).

   - ADMIN_TELEGRAM_ID
     - Telegram user id granted unlimited AI quota (admin).

   - CRON_SECRET
     - Shared secret used to authorize the daily reminder cron route.

3. Supabase Connection Pooling
   This bot should use the Supabase pooler endpoint in production because serverless functions must not exhaust database connections.

Recommended configuration:

1. Copy the Supabase pooled connection string.

2. Put it in DATABASE_URL.

3. Keep the direct PostgreSQL string in DIRECT_URL.

4. Use DIRECT_URL for Prisma migrations and DATABASE_URL for runtime queries.

Example Prisma datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

4. Telegram Bot Token Setup
   1. Open Telegram and message @BotFather.

   2. Create a new bot.

   3. Copy the bot token from BotFather.

   4. Save the token in TELEGRAM_BOT_TOKEN.

   5. Keep the bot name and username consistent with the project identity.

5. Local Development
   Run the app locally with Bun:

```bash
bun dev
```

If Prisma schema changes occur, generate the client and apply migrations:

```bash
bun prisma generate
bun prisma migrate dev
```

6. Frontend Architecture & Clean Code Structure

- Provider Setup: Wrap app/layout.tsx with <Providers> initializing @tanstack/react-query.

- Helpers & Utilities (lib/helpers/):
  - Extract date formatters, time-based greeting logic (e.g., getGreeting()), calculation utilities, and digit converters into lib/helpers/.

- Component Decomposition (app/dashboard/components/):
  - Keep each component single-purpose and under 200 lines:
    - Header.tsx (Greeting + Telegram User info)
    - MonthSelector.tsx (Month/Year state selector)
    - SummaryCards.tsx (Net Balance, Income, Expense)
    - ViewTabs.tsx (Tab switchers for History vs. Analytics)
    - TransactionList.tsx (Date-grouped transactions)
    - AnalyticsView.tsx (Recharts spending category chart)

7. Vercel Deployment
   1. Push the repository to your Git provider.

   2. Import the project into Vercel.

   3. Configure the production environment variables:
      - DATABASE_URL
      - DIRECT_URL
      - NEXT_PUBLIC_SITE_URL
      - TELEGRAM_BOT_TOKEN
      - GEMINI_API_KEY
      - CRON_SECRET

   4. Deploy the project.

   5. Confirm the live Vercel domain.

Telegram Webhook URL
Set the Telegram webhook to the live HTTPS endpoint for the deployed app. The exact path is `/api/telegram` on the production domain assigned by Vercel.

`setWebhook` Command
Call Telegram `setWebhook` with the bot token and the webhook URL for the deployed app. The webhook URL must be the production HTTPS domain plus `/api/telegram`.

```bash
curl -F "url=https://<your-domain>/api/telegram" \
  "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook"
```

8. Operational Checks

- Verify /start responds in Myanmar language.
- Verify Myanmar digits such as ၁၂၃၄၅ are parsed correctly.
- Verify /balance and /report return chat-specific data.
- Verify /monthly and /yearly return aggregated table-style summaries with Total Income, Total Expense, Net Balance, and Category Breakdown.
- Verify Web Mini App filters transactions dynamically when toggling months/years via MonthSelector.tsx.
- Ensure all component files adhere to the ES6 arrow function syntax and stay strictly under 200 lines of code.
- Verify webhook handlers return quickly enough for serverless execution.
