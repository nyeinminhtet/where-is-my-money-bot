# Repository Agent Rules

## Mission

AI agents working in this repository are maintaining `where-is-my-money-bot`, a Myanmar-language Telegram finance bot and web Mini App built with Next.js (App Router), Prisma, Supabase PostgreSQL, TanStack React Query, and Recharts.

## Mandatory Reading

- Read `INSTRUCTIONS.md` (in the repository root) before making changes.
- Read the relevant Next.js guide in `node_modules/next/dist/docs/` before changing App Router behavior, route handlers, deployment assumptions, or file conventions.
- Heed deprecation notices and version-specific Next.js documentation over memory.

## Package Manager & Tooling

- Use **Bun** (`bun`) as the primary package manager for adding dependencies or running scripts (e.g., `bun add <package>`).

## Frontend, Clean Code & Architecture Rules

- **ES6 Functions Only:** All TypeScript/JavaScript functions (components, helpers, event handlers) MUST strictly use ES6 arrow functions (`const myFunction = () => {}`). Do not use traditional `function` declarations.
- **Strict 200-Line File Limit:** Every single component file MUST NOT exceed **200 lines of code**. If a file grows close to 200 lines, refactor and break it down into smaller, focused sub-components.
- **Helper & Utility Extraction:** Keep components clean and focused purely on rendering and state. All pure utility functions, date formatters, time-based greeting logic, calculation helpers, and transformation logic MUST be extracted into standalone files inside `lib/helpers/` or `lib/utils/`.
- **Data Fetching:** Use `@tanstack/react-query` for client-side data fetching. Avoid raw `useEffect` + `fetch` data-fetching hooks inside client components.
- **Modular Component Design:** Keep `page.tsx` files strictly as orchestrators/containers. Do not dump all JSX, state, and complex UI logic directly in `page.tsx`. Break UI elements into small, reusable components under `app/<feature>/components/` (e.g., `app/dashboard/components/Header.tsx`, `MonthSelector.tsx`, `SummaryCards.tsx`, `AnalyticsView.tsx`, `TransactionList.tsx`).
- **Analytics & Visualizations:** Use `recharts` for charts and category spending breakdowns.
- Respect the repository structure and keep App Router code in `app/`.

## Behavioral Rules

- Do not invent placeholder code, fake data, or temporary TODO stubs in committed files.
- Do not hardcode production-only URLs unless the task explicitly asks for a concrete deployed value already known to be correct.
- Prefer small, reviewable, clean, and highly reusable changes that match the project architecture.
- Never edit generated assets directly.

## Serverless Constraints

- Treat Telegram webhook handlers as latency-sensitive serverless endpoints.
- Return from webhook handlers quickly.
- Avoid long-running loops, blocking work, or database-heavy fan-out inside the request path.
- If a feature requires more time than a serverless function can safely hold, split it into smaller steps or defer the work.
- Preserve idempotency where possible so repeated Telegram updates do not create duplicate records.
- Monthly and yearly report queries (both API routes and bot commands) must be optimized for serverless execution using Prisma `groupBy`, Date Range filters (`month`/`year`), and PostgreSQL `date_trunc` patterns instead of loading and aggregating large transaction sets in application memory.
- Avoid per-request full-table scans when calculating reports; push aggregation into PostgreSQL and return only the grouped results needed for the UI/Table output.

## Gemini API Handling

- Centralize all Gemini access in `lib/ai/gemini.ts`. Do not create ad-hoc client instances or inline prompt/response schemas in handlers or services.
- Read Gemini credentials from env only (`GEMINI_API_KEY`, optional `GEMINI_MODEL`, `GEMINI_PROXY_URL`). Never hardcode keys, URLs, or model names in committed code.
- Route every Gemini request through the shared rate limiter (`lib/rate-limiter.ts`, `waitForRateLimit`) so free-tier quota limits are respected and requests are throttled rather than rejected.
- Treat the raw Gemini response as untrusted input. Validate and coerce it against the exported Zod `responseSchema` before use; never trust a field the schema did not type.
- Preserve the user's original Myanmar text (amounts, titles, categories) returned by the model; only normalize the intended `type`/`amount`/`category` fields.
- All Gemini calls are latency-sensitive within a Telegram webhook. Await them briefly and return a clear error message if parsing fails; do not block the request with retries beyond the rate limiter's guidance.

## Audio / Image Update Processing

- Voice note (`.ogg`) and receipt-photo handling is centralized in `lib/helpers/multimodal.ts` via `processMultimodalMedia` and must be used by both `handlers/voice.handler.ts` and `handlers/photo.handler.ts`.
- Download Telegram media through `lib/telegram/client.ts` (`getFile` / `downloadFile`) and pass the buffer plus the correct `mimeType` to `parseInputWithGemini` — do not re-download or build file URLs in handlers.
- Keep media processing out of the synchronous request path as much as possible: send a `ChatAction` first, then fetch the file and call the AI model.
- Handle each returned transaction individually and preserve idempotency (do not create duplicate records on repeated updates).
- After saving expenses, call `checkAndSendBudgetWarning` so budget warnings stay consistent with the text-only flow.

## Data and Encoding Rules

- Preserve Myanmar text exactly as entered by the user.
- Save and read all text as UTF-8.
- Do not normalize away Myanmar script in a way that changes meaning.
- Keep digit conversion limited to the intended Myanmar-to-English parsing path.

## Review Standard

- If a requested change conflicts with these rules, call out the conflict before proceeding.
- When reviewing or editing code, focus on correctness, runtime behavior, clean code standards, and data integrity first.
- If the change touches Telegram flows or Mini App UI, verify chat-scoped state handling, date filtering correctness, and responsiveness.

## Security Rules

- **Webhook Verification:** All Telegram webhook handlers must verify `X-Telegram-Bot-Api-Secret-Token` against `TELEGRAM_WEBHOOK_SECRET` using `verifyWebAppSecret()` before processing any update. Return 401 immediately on mismatch.
- **Mini App Data Validation:** All transaction API routes must validate Telegram Mini App `initData` via `validateTelegramInitData()` (HMAC-SHA256 + 30-minute expiry) before reading or writing user data.
- **Ownership Enforcement:** Every transaction read/write/delete must verify `authData.user.id` matches the resource owner. Never allow cross-user access.
- **Timing-Safe Comparisons:** All secret and hash comparisons MUST use `crypto.timingSafeEqual` — never `===`. Guard against length mismatches before comparing.
- **Rate Limiting:** Apply `checkRateLimit()` from `lib/rate-limiter.ts` to all user-facing API routes. Default: 30 requests per 60 seconds per user.
- **Secrets in Env Only:** Never hardcode `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_BOT_TOKEN`, or `CRON_SECRET` in committed code. Read from `lib/env.ts` only.
- **Frontend Auth Headers:** All frontend API calls to `/api/transactions` must send `x-telegram-init-data` header via `getTelegramInitData()` from `lib/telegram-webapp.ts`.
