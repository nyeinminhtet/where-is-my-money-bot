# Where Is My Money

**AI-Powered Financial Tracking Telegram Bot & Next.js Mini App**

A Myanmar-language expense tracker that lets you log income and expenses from Telegram — by typing plain language, sending a voice note, or snapping a receipt photo — then review everything on a rich web dashboard.

## Features

- **Multimodal AI Expense Logging** — Parse unstructured Burmese/English natural-language text, voice messages (`.ogg`), and receipt photo scans through Google's Gemini API. Just say or type what you spent and the bot figures out the rest.
- **Interactive Mini App Dashboard** — A Next.js web app with React, Tailwind CSS, and Shadcn UI that shows monthly balances, visual budget progress bars, and full transaction history with charts.
- **Rate-Limited Pipeline** — Queue-backed API request throttling keeps AI operations safe and predictable under free-tier quota limits.
- **Localization Support** — Tailored for Myanmar Kyat (MMK) currency formatting and local-language parsing, including native Myanmar digits (`၁၂၀၀၀`).

## Tech Stack

| Layer                   | Technology                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| **Frontend / Mini App** | Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts                      |
| **Backend**             | Node.js, Telegram Bot API                                                                |
| **Database**            | PostgreSQL + Prisma ORM (Supabase)                                                       |
| **AI Integration**      | Google Gemini (SDK — Multimodal Audio/Vision API, default model `gemini-3.1-flash-lite`) |

## Architecture Overview

```
app/
  api/            # Serverless routes (Telegram webhook, transactions, cron)
  dashboard/      # Web Mini App (components + page)
components/       # Shared UI components
constants/        # Category constants
handlers/         # Per-command Telegram handlers
lib/
  ai/             # Consolidated Gemini client, schemas, and parsers
  charts/         # QuickChart + report chart generators
  helpers/        # Shared business logic (multimodal, summary, budget, breakdown)
  hooks/          # Client-side hooks (useExpenses, useDebounce)
  schema/         # Zod transaction schema
  telegram/       # Telegram API client + update parser
  bot.ts          # Webhook dispatcher / routing
services/         # Prisma data-access services
types/            # Shared TypeScript types
utils/            # Pure helpers (date, currency format, keyboard)
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (this project's preferred package manager)
- A [Supabase](https://supabase.com) PostgreSQL database
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- A Google AI Studio / Gemini API key

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy the sample file and fill in your values:

```bash
cp .env.example .env
```

Key variables (full reference in [`.env.example`](.env.example)):

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# App
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"

# Telegram
TELEGRAM_BOT_TOKEN="123456789:AA..."
TELEGRAM_WEBHOOK_SECRET="your-random-secret"
ADMIN_TELEGRAM_ID="0"

# Gemini AI
GEMINI_API_KEY="your-key-here"
GEMINI_MODEL="gemini-3.1-flash-lite"

# Cron
CRON_SECRET=""
```

### 3. Generate Prisma client & apply migrations

```bash
bunx prisma generate
bunx prisma migrate deploy
```

### 4. Run locally

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Mini App dashboard.

## Telegram Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token into `TELEGRAM_BOT_TOKEN`.
2. Deploy the app so it has a public HTTPS endpoint.
3. Choose a random secret and set it as `TELEGRAM_WEBHOOK_SECRET`.
4. Register the webhook with the secret token:

```bash
curl -F "url=https://<your-domain>/api/telegram" \
  -F "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
  "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook"
```

## Demo

- 🤖 **Live Bot:** [@where_is_my_money_mm_bot](https://t.me/where_is_my_money_mm_bot)

<!-- ## Screenshots

### Mini App Dashboard

`[Insert Mini App screenshot here]`

### Budget Progress & Analytics

`[Insert budget/analytics screenshot here]`

### Transaction History

`[Insert transaction list screenshot here]` -->

## Usage Guide

> 🇲🇲 The bot's UI is in Myanmar. Below are the core flows.

### Get started

Send `/start` to receive onboarding instructions.

### Record income / expense

Send an amount in English or Myanmar digits:

- `12000`
- `၁၂၀၀၀`

Then pick a category, add a short description, and confirm the entry.

**Faster:** type or dictate a full sentence (e.g. _"coffee ၂၀၀၀"_), send a voice note, or send a photo of a receipt — the bot parses it automatically.

### Your balance

Send `/balance` for the current balance of that Telegram chat.

### Reports

- `/report` — summary for the selected time window
- `/monthly` — current month breakdown (total income, total expense, net balance, category breakdown)
- `/yearly` — current year breakdown

### Undo

After a transaction saves, tap the **Undo** button to reverse the latest entry.

## Project Scripts

```bash
bun run dev      # Start the dev server
bun run build    # Generate Prisma client + production build
bun run start    # Start the production server
bun run lint     # Run ESLint
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome. Please open an issue or pull request for any improvements, and follow the guidelines in `AGENTS.md` and `INSTRUCTIONS.md` when making changes.
