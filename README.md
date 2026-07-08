# Where Is My Money Bot

A Myanmar-language Telegram bot for tracking income and expenses with a simple guided chat flow.

## What It Does

`Where Is My Money Bot` helps users record daily transactions directly in Telegram. The bot supports multi-user use through Telegram chat IDs, accepts Myanmar digits as input, and guides the user through a short sequence:

1. Amount
2. Category selection
3. Description
4. Success confirmation with Undo

It is designed for fast, low-friction money tracking in Myanmar language.

## Stack

- Next.js App Router
- Serverless API routes only
- Prisma ORM
- Supabase PostgreSQL
- Telegram Bot API

## Features

- Multi-user support by Telegram `chat_id`
- Myanmar-to-English digit parsing
- Conversation-based transaction capture
- `/start` onboarding
- `/balance` balance lookup
- `/report` summary reporting
- `/monthly` monthly financial breakdowns
- `/yearly` yearly financial breakdowns
- Undo for the most recent saved transaction

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file at the project root and define:

- `DATABASE_URL`
- `DIRECT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

### 3. Prepare Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Locally

```bash
npm run dev
```

## Telegram Setup

1. Open `@BotFather` in Telegram.
2. Create a bot and copy the token.
3. Put the token into `TELEGRAM_BOT_TOKEN`.
4. Deploy the app.
5. Set the webhook to the live HTTPS endpoint for the deployed app.

The webhook path is `/api/telegram/webhook` on the live Vercel domain for your deployment.

## User Guide

### စတင်အသုံးပြုရန်

Send `/start` to begin. The bot will explain how to enter your money records.

### ငွေသွင်း / ငွေထုတ် မှတ်ရန်

Send an amount in either English digits or Myanmar digits.

Examples:

- `12000`
- `၁၂၀၀၀`

Then choose a category from the keyboard, add a short description, and confirm the saved entry.

### လက်ကျန်ကြည့်ရန်

Send `/balance` to see your current balance summary for that Telegram chat.

### အစီရင်ခံစာကြည့်ရန်

Send `/report` to view a transaction summary for the selected time window.

### လစဉ် အကျဉ်းချုပ်ကြည့်ရန်

Send `/monthly` to view the current month's breakdown. The bot returns a table-style summary with:

- Total Income
- Total Expense
- Net Balance
- Category Breakdown

### နှစ်စဉ် အကျဉ်းချုပ်ကြည့်ရန်

Send `/yearly` to view the current year's breakdown. The bot returns the same table-style summary fields:

- Total Income
- Total Expense
- Net Balance
- Category Breakdown

### Undo

After a transaction is saved, the bot shows an Undo button. Use it immediately if you need to reverse the latest entry.

## Project Notes

- The application is intended to run as a serverless Next.js deployment.
- Webhook handlers should stay fast and reliable.
- Myanmar text must remain UTF-8 encoded end to end.
