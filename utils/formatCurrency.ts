/**
 * Format Myanmar Kyat currency.
 *
 * Example:
 * 1500000 -> "1,500,000 Ks"
 */

export const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString("en-US")} Ks`;
};
