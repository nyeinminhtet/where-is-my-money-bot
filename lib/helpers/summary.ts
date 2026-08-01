export const getMonthDateRange = (year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return { startDate, endDate };
};

export const formatAmount = (amount: number) => amount.toLocaleString("en-US");
