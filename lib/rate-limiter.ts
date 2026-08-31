/**
 * Rate Limiters
 *
 * 1. Gemini Free-Tier Rate Limiter — enforces a minimum 1.5-second delay
 *    between consecutive Gemini API calls to stay within the 15 RPM limit.
 *
 * 2. API Request Rate Limiter — sliding-window counter per identifier
 *    (e.g. per user) to prevent abuse on HTTP endpoints.
 */

// --- Gemini Rate Limiter ---

let lastCallTime = 0;
const MIN_CALL_INTERVAL_MS = 1_500;

export const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < MIN_CALL_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_CALL_INTERVAL_MS - elapsed),
    );
  }
  lastCallTime = Date.now();
};

export const withRateLimit = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  await waitForRateLimit();
  return fn();
};

// --- API Request Rate Limiter ---

const RATE_LIMIT_WINDOW_MS = 60_000;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

const cleanup = () => {
  const now = Date.now();
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(key);
    }
  }
};

export const checkRateLimit = (
  identifier: string,
  maxRequests = 30,
): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();

  if (requestCounts.size > 10_000) {
    cleanup();
  }

  const entry = requestCounts.get(identifier);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterMs: 0 };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfterMs = entry.resetAt - now;
    return { allowed: false, retryAfterMs };
  }

  return { allowed: true, retryAfterMs: 0 };
};
