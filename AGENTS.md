# Repository Agent Rules

## Mission

AI agents working in this repository are maintaining `where-is-my-money-bot`, a Myanmar-language Telegram finance bot built with the Next.js App Router, Prisma, and Supabase PostgreSQL.

## Mandatory Reading

- Read [`/Users/nyeinminhtet/Desktop/personal-projects/where-is-my-money-bot/INSTRUCTIONS.md`](/Users/nyeinminhtet/Desktop/personal-projects/where-is-my-money-bot/INSTRUCTIONS.md) before making changes.
- Read the relevant Next.js guide in `node_modules/next/dist/docs/` before changing App Router behavior, route handlers, deployment assumptions, or file conventions.
- Heed deprecation notices and version-specific Next.js documentation over memory.

## Behavioral Rules

- Do not invent placeholder code, fake data, or temporary TODO stubs in committed files.
- Do not hardcode production-only URLs unless the task explicitly asks for a concrete deployed value already known to be correct.
- Prefer small, reviewable changes that match the project architecture.
- Keep functions as arrow functions when writing new TypeScript application code.
- Respect the repository structure and keep App Router code in `app/`.
- Never edit generated assets directly.

## Serverless Constraints

- Treat Telegram webhook handlers as latency-sensitive serverless endpoints.
- Return from webhook handlers quickly.
- Avoid long-running loops, blocking work, or database-heavy fan-out inside the request path.
- If a feature requires more time than a serverless function can safely hold, split it into smaller steps or defer the work.
- Preserve idempotency where possible so repeated Telegram updates do not create duplicate records.
- Monthly and yearly report queries must be optimized for serverless execution using Prisma `groupBy` and PostgreSQL `date_trunc` patterns instead of loading and aggregating large transaction sets in application memory.
- Avoid per-request full-table scans when calculating `/monthly` and `/yearly`; push aggregation into PostgreSQL and return only the grouped results needed for the table output.

## Data and Encoding Rules

- Preserve Myanmar text exactly as entered by the user.
- Save and read all text as UTF-8.
- Do not normalize away Myanmar script in a way that changes meaning.
- Keep digit conversion limited to the intended Myanmar-to-English parsing path.

## Review Standard

- If a requested change conflicts with these rules, call out the conflict before proceeding.
- When reviewing or editing code, focus on correctness, runtime behavior, and data integrity first.
- If the change touches Telegram flows, verify chat-scoped state handling and undo behavior.
