# Product Requirements Document

## Project Name

**Where Is My Money Bot & Web Mini App**

## Summary

`Where Is My Money Bot` is a Telegram bot and integrated Telegram Web Mini App (Dashboard) for tracking personal income and expenses in Myanmar language. Users can log transactions through a short guided chat flow in Telegram — including free-text messages, voice notes, and receipt photos parsed by the Google Gemini Multimodal API — or view, filter, and analyze their financial habits using a modern Web Mini App built with Next.js (App Router), TanStack React Query, and Recharts.

## Problem Statement

People often record money in chat apps, notes, or memory, which makes balances hard to trust and history difficult to analyze over time. A Myanmar-first Telegram bot combined with a lightweight visual dashboard reduces the friction of daily bookkeeping and gives users immediate visual insights into their spending habits.

## Goals

- Make transaction logging fast enough for daily use (under 10 seconds).
- Support Myanmar text and Myanmar digit input naturally.
- Keep each chat/user isolated with its own state and ledger.
- Provide simple balance, summary reporting, and a visual Web Mini App Dashboard.
- Allow the last transaction to be reversed through Undo.
- Provide dynamic month/year filtering and category-based spending analytics in the Mini App.
- Enforce high code-quality standards: ES6 arrow functions, modular sub-200-line components, and helper separation.

## Scope

### In Scope

- **Telegram Bot Interaction:** Income and expense tracking via chat flow.
- **Telegram Web Mini App (Dashboard):**
  - Time-based personalized greeting (`Good Morning/Afternoon/Evening, {Name}`).
  - Dynamic Month Selector (`< Month Year >`) to view historical transactions.
  - Financial Summary Cards (Net Balance, Total Income, Total Expense).
  - Dual View Tabs: Transaction History (📋) vs. Analytics Chart (📊).
  - Spending category breakdown using `recharts` Donut/Pie visual charts.
  - Sub-200-line modular component structure under `app/dashboard/components/`.
  - Helper logic separated into `lib/helpers/`.
  - Client-side data fetching with `@tanstack/react-query`.
- Multi-user support using Telegram `chat_id` and `telegramId`.
- Automatic Myanmar-to-English digit parsing.
- Guided state flow: Amount -> Category keyboard -> Description -> Success confirmation with Undo button.
- **AI-Assisted Key Features (Google Gemini Multimodal API):**
  - `Voice message parsing (.ogg)` — transcribe and extract expense/income details from voice notes.
  - `Receipt photo OCR scanning` — scan receipt photos and parse transaction line items.
  - `Natural-language expense logging` — parse unstructured Burmese/English text into structured transactions.
- Queue-backed API rate limiting so Gemini requests stay within free-tier quota limits.
- Bot Commands: `/start`, `/balance`, `/report`, `/monthly`, `/yearly`, `/today`, `/budget`, `/undo`, `/help`.
- Data persistence using Prisma ORM with Supabase PostgreSQL.
- Next.js App Router route handlers as the API surface.

### Out of Scope

- Bank account auto-sync.
- Forecasting and budgeting automation.
- Multi-currency support.

## Code Quality & Architecture Standards

- **ES6 Arrow Functions:** Mandatory usage of ES6 arrow functions for components, handlers, and helpers (`const Component = () => {}`).
- **200-Line Limit:** Every component file strictly capped under 200 lines to ensure readability and single-responsibility.
- **Helper Folder Structure:** All standalone business logic, date manipulation, calculations, and string transformers reside in `lib/helpers/`.
- **Reusability:** UI components must be modular, reusable, and cleanly decoupled from direct API fetching.

## Technical Constraints

- **Framework:** Next.js App Router (TypeScript).
- **Package Manager:** Bun (`bun`).
- **Database:** Supabase PostgreSQL with Prisma ORM.
- **State & Data Fetching:** `@tanstack/react-query`.
- **UI & Charts:** Tailwind CSS, `recharts`, `lucide-react`.
- **AI Integration:** Google Gemini Multimodal API (text, audio, and vision inputs) with queue-backed rate limiting.

## Success Metrics

- Transaction logging completed in under 10 seconds.
- Web Mini App initial load time under 1.5 seconds with cached React Queries.
- Zero state leakage between Telegram chats.
- Clean codebase compliance: Zero files exceeding 200 lines and 100% ES6 function consistency.
