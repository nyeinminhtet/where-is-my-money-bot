/**
 * Gemini Free-Tier Rate Limiter
 *
 * Enforces a minimum 1.5-second delay between consecutive Gemini API calls
 * to stay within the 15 RPM free-tier limit.
 *
 * This is a module-level singleton — the timestamp persists across calls
 * within the same serverless instance.
 */

let lastCallTime = 0;
const MIN_CALL_INTERVAL_MS = 1_500;

/**
 * Waits if necessary to enforce minimum spacing between Gemini API calls.
 * Call this before every Gemini API invocation.
 */
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

/**
 * Wraps an async function with rate limiting.
 * Guarantees at least 1.5 seconds between consecutive invocations.
 */
export const withRateLimit = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  await waitForRateLimit();
  return fn();
};
