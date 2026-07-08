# Developer Instructions

These instructions describe how to set up, configure, and deploy `where-is-my-money-bot`.

## Repository Rules

- Use TypeScript for all application code.
- Keep the project aligned with the Next.js App Router.
- Build Telegram logic as serverless route handlers only.
- Place app code in `app/`.
- Do not edit generated assets directly.
- Do not leave placeholder code, fake data, or temporary stubs in committed files.
- Preserve Myanmar text exactly and save files as UTF-8.

## 1. Install Dependencies

```bash
npm install
```

If Prisma is not yet installed in your environment, add it before generating the client:

```bash
npm install prisma @prisma/client
```

## 2. Environment Variables

Create a `.env` file at the project root and define:

- `DATABASE_URL`
- `DIRECT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

### Variable Purpose

- `DATABASE_URL`
  - Use the Supabase pooler URL for runtime database access.
- `DIRECT_URL`
  - Use the direct PostgreSQL URL for Prisma migrations.
- `TELEGRAM_BOT_TOKEN`
  - The token issued by `@BotFather`.
- `TELEGRAM_WEBHOOK_SECRET`
  - A shared secret used to validate incoming webhook requests.

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

1. Open Telegram and message `@BotFather`.
2. Create a new bot.
3. Copy the bot token from BotFather.
4. Save the token in `TELEGRAM_BOT_TOKEN`.
5. Keep the bot name and username consistent with the project identity.

## 5. Local Development

Run the app locally:

```bash
npm run dev
```

If Prisma is in use, generate the client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## 6. Vercel Deployment

1. Push the repository to your Git provider.
2. Import the project into Vercel.
3. Configure the production environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_WEBHOOK_SECRET`
4. Deploy the project.
5. Confirm the live Vercel domain.

### Telegram Webhook URL

Set the Telegram webhook to the live HTTPS endpoint for the deployed app. The exact path is `/api/telegram/webhook` on the production domain assigned by Vercel.

### `setWebhook` Command

Call Telegram `setWebhook` with the bot token, the webhook URL for the deployed app, and the shared secret token. The webhook URL must be the production HTTPS domain plus `/api/telegram/webhook`.

## 7. Operational Checks

- Verify `/start` responds in Myanmar language.
- Verify Myanmar digits such as `၁၂၃၄၅` are parsed correctly.
- Verify `/balance` and `/report` return chat-specific data.
- Verify `/monthly` and `/yearly` return aggregated table-style summaries with Total Income, Total Expense, Net Balance, and Category Breakdown.
- Keep monthly and yearly report queries server-side, using Prisma `groupBy` and PostgreSQL `date_trunc` so report generation remains safe in a serverless environment.
- Verify Undo only affects the most recent transaction when intended.
- Verify webhook handlers return quickly enough for serverless execution.
