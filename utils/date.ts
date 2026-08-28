const MYANMAR_TIMEZONE = "Asia/Yangon";

// Myanmar is UTC+6:30 (equivalent to this offset in milliseconds).
export const MYANMAR_OFFSET_MS = 6.5 * 60 * 60 * 1000;

/**
 * Get current date in Myanmar timezone.
 */
export const getMyanmarDate = (): Date => {
    return new Date(new Date().toLocaleString("en-US", {
        timeZone: MYANMAR_TIMEZONE,
    }));
};

/**
 * Get current month number.
 *
 * January = 1
 */
export const getCurrentMonth = (): number => {
    return getMyanmarDate().getMonth() + 1;
};

/**
 * Get previous month range (start and end date).
 * Example: If today is July 15, 2024, it will return June 1, 2024 - June 30, 2024.
 * @returns { start: Date, end: Date }
 */
export const getPreviousMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end };
};

/**
 * Get current year.
 */
export const getCurrentYear = (): number => {
    return getMyanmarDate().getFullYear();
};

/**
 * Format date for display.
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        timeZone: MYANMAR_TIMEZONE,
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * Get start and end date of current month.
 */
export const getCurrentMonthRange = (): {
    start: Date;
    end: Date;
} => {
    const now = getMyanmarDate();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return {
        start,
        end,
    };
};

/**
 * Get a date range (start and end) for a specific month and year.
 * @param year - e.g. 2024
 * @param month - 1-based month (January = 1)
 * @returns { startDate: Date, endDate: Date } where endDate is exclusive (start of next month).
 */
export const getMonthDateRange = (year: number, month: number): {
    startDate: Date;
    endDate: Date;
} => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    return { startDate, endDate };
};

/**
 * Get start and end date of current year.
 */
export const getCurrentYearRange = (): {
    start: Date;
    end: Date;
} => {
    const now = getMyanmarDate();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return {
        start,
        end,
    };
};

/**
 * Get start and end date of today.
 */
export const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
