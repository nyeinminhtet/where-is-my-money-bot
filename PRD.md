# Product Requirements Document

## Project Name

**Where Is My Money Bot**

## Summary

`Where Is My Money Bot` is a Telegram bot for tracking personal income and expenses in Myanmar language. Users log transactions through a short guided chat flow that captures amount, category, and description, then saves the entry to a chat-scoped ledger.

## Problem Statement

People often record money in chat apps, notes, or memory, which makes balances hard to trust. A Myanmar-first Telegram bot reduces the friction of daily bookkeeping and keeps the data in one place.

## Goals

- Make transaction logging fast enough for daily use.
- Support Myanmar text and Myanmar digit input naturally.
- Keep each chat isolated with its own state and ledger.
- Provide simple balance and summary reporting.
- Allow the last transaction to be reversed through Undo.

## Scope

### In Scope

- Telegram bot interaction for income and expense tracking.
- Multi-user support using Telegram `chat_id`.
- Automatic Myanmar-to-English digit parsing.
- Guided state flow:
  - Amount
  - Category keyboard
  - Description
  - Success confirmation with Undo button
- Commands:
  - `/start`
  - `/balance`
  - `/report`
  - `/monthly`
  - `/yearly`
- Data persistence using Prisma ORM with Supabase PostgreSQL.
- Next.js App Router route handlers as the only server API surface.

### Out of Scope

- Bank sync.
- Receipt OCR.
- Forecasting and budgeting automation.
- Multi-currency support.
- A separate dashboard unless introduced later.

## Target Users

- Individuals tracking daily spending in Myanmar language.
- Small households sharing one bot across multiple Telegram chats.
- Users who prefer quick chat entry over a separate finance app.

## User Journey

### 1. Start

The user sends `/start`. The bot introduces itself and invites the first amount.

### 2. Amount

The user sends an amount using English digits or Myanmar digits. The bot normalizes Myanmar digits before parsing.

### 3. Category

The bot shows a category keyboard. The user selects one category for the transaction.

### 4. Description

The bot asks for a short description and stores the final record after the reply.

### 5. Success and Undo

The bot confirms the saved transaction and displays an Undo button for the latest entry.

## Functional Requirements

### Multi-User Support

- Every conversation is scoped to Telegram `chat_id`.
- State must never leak across chats.
- Each chat can progress through the flow independently.

### Myanmar Digit Parsing

- Accept Myanmar digits `၀၁၂၃၄၅၆၇၈၉`.
- Convert them to `0123456789` before validation.
- Reject invalid numeric input after normalization.

### State Flow

The bot must process one pending transaction flow per chat at a time.

State order:

1. Amount
2. Category
3. Description
4. Success with Undo

If a new amount arrives while a flow is pending, the bot must restart or safely replace the flow without corrupting stored state.

### Commands

- `/start`
  - Explain the bot
  - Prompt for the first amount
- `/balance`
  - Show the current balance for the chat
  - Include income, expense, and net totals when possible
- `/report`
  - Show a readable summary for a recent time window
  - Support at least today, week, and month summaries
- `/monthly`
  - Return the current month's aggregated data
  - Include Total Income, Total Expense, Net Balance, and Category Breakdown
  - Format the response as a clean text-based table grid for readability
- `/yearly`
  - Return the current year's aggregated data
  - Include Total Income, Total Expense, Net Balance, and Category Breakdown
  - Format the response as a clean text-based table grid for readability

### Undo

- Undo must be available immediately after a successful save.
- Undo should reverse the latest transaction for that chat.
- Undo must keep the data model auditable where possible.

## Data Model

At minimum, the database should store:

- Telegram chat identity
- Telegram user identity when available
- Transaction records
- Pending conversation state
- Categories
- Undo metadata or soft-delete markers

Recommended transaction fields:

- `id`
- `chatId`
- `telegramUserId`
- `type`
- `amount`
- `category`
- `description`
- `createdAt`
- `updatedAt`
- `reversedAt` or `isReversed`

## Non-Functional Requirements

- Fast response to Telegram webhooks.
- Stable behavior in serverless environments.
- UTF-8 safe handling for Myanmar text.
- Clear error messages when input is invalid.
- Minimal runtime overhead.

## Technical Constraints

- Next.js App Router only.
- Serverless API only, implemented as route handlers.
- No custom Node server.
- Prisma ORM for persistence.
- Supabase PostgreSQL as the database.
- Telegram webhook integration.

## Monthly and Yearly Reports

- Monthly and yearly reports must be computed from the transaction ledger without loading unnecessary raw rows into application memory.
- The bot should aggregate data for `/monthly` and `/yearly` with:
  - Total Income
  - Total Expense
  - Net Balance
  - Category Breakdown
- The output should use a clean text-based table grid so the report remains readable inside Telegram.
- Report generation must stay fast enough for serverless execution.

## Suggested Architecture

- Telegram sends updates to a Next.js webhook route.
- The route validates the request and dispatches the command or state handler.
- Prisma persists data in Supabase PostgreSQL.
- The webhook returns quickly to stay within serverless execution limits.
- Any non-essential work must be deferred or simplified.

## Success Metrics

- A user can log a transaction in under 10 seconds.
- Balance queries return correct totals per chat.
- Myanmar digit input is accepted without manual conversion.
- Undo reliably reverses the latest saved transaction.
- No state leaks across chats.

## Acceptance Criteria

- `/start` begins the guided flow.
- Amount parsing works for both Myanmar and English digits.
- Category selection uses Telegram UI controls.
- Description capture completes the transaction.
- The success message includes Undo.
- `/balance` and `/report` return correct chat-scoped summaries.
- Multiple chats can use the bot independently at the same time.

## Future Enhancements

- Category customization per chat.
- Recurring transaction templates.
- Monthly CSV export.
- Optional analytics dashboard.
- Natural-language transaction classification.
