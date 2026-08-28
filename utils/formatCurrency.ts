/**
 * Format Myanmar Kyat currency.
 *
 * Example:
 * 1500000 -> "1,500,000 Ks"
 */

export const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString("en-US")} Ks`;
};

/**
 * Format a number without a currency suffix (e.g. Mini App figures that add their own "Ks").
 *
 * Example:
 * 1500000 -> "1,500,000"
 */
export const formatAmount = (amount: number): string =>
    amount.toLocaleString("en-US");
