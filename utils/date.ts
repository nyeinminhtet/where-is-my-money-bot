const MYANMAR_TIMEZONE = "Asia/Yangon";

/**
 * Get current date in Myanmar timezone.
 */
export function getMyanmarDate(): Date {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: MYANMAR_TIMEZONE,
    }),
  );
}

/**
 * Get current month number.
 *
 * January = 1
 */
export function getCurrentMonth(): number {
  return getMyanmarDate().getMonth() + 1;
}

/**
 * Get previous month range (start and end date).
 * Example: If today is July 15, 2024, it will return June 1, 2024 - June 30, 2024.
 * @returns { start: Date, end: Date }
 */
export function getPreviousMonthRange() {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);

  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  return { start, end };
}

/**
 * Get current year.
 */
export function getCurrentYear(): number {
  return getMyanmarDate().getFullYear();
}

/**
 * Format date for display.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    timeZone: MYANMAR_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get start and end date of current month.
 */
export function getCurrentMonthRange(): {
  start: Date;
  end: Date;
} {
  const now = getMyanmarDate();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  return {
    start,
    end,
  };
}

/**
 * Get start and end date of current year.
 */
export function getCurrentYearRange(): {
  start: Date;
  end: Date;
} {
  const now = getMyanmarDate();

  const start = new Date(now.getFullYear(), 0, 1);

  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return {
    start,
    end,
  };
}

/**
 * Get start and end date of today.
 */
export function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
