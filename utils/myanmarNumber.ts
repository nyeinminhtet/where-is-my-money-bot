const MYANMAR_DIGITS: Record<string, string> = {
  "၀": "0",
  "၁": "1",
  "၂": "2",
  "၃": "3",
  "၄": "4",
  "၅": "5",
  "၆": "6",
  "၇": "7",
  "၈": "8",
  "၉": "9",
};

export const normalizeMyanmarDigits = (value: string): string =>
  value.replace(/[၀-၉]/g, (digit) => MYANMAR_DIGITS[digit] ?? digit);

export function parseMyanmarNumber(value?: string | null): number {
  if (!value) return 0;

  const normalized = value

    .replace(/[၀-၉]/g, (digit) => MYANMAR_DIGITS[digit])

    .replace(/,/g, "")

    .trim();

  const amount = Number(normalized);

  return Number.isNaN(amount) ? 0 : amount;
}
