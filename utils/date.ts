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
