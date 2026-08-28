import { generateCategoryChartUrl } from "./quickchart";
import { sendMessage, sendPhoto } from "@/lib/telegram/client";

export const sendReportWithChart = async (
  chatId: number | string,
  message: string,
  categoryExpenses: Array<{
    category: string;
    _sum: { amount: number | null };
  }>,
) => {
  const chartData = categoryExpenses.map((item) => ({
    category: item.category,
    amount: item._sum.amount ?? 0,
  }));

  if (chartData.length > 0) {
    const chartUrl = generateCategoryChartUrl(chartData);
    return sendPhoto(chatId, chartUrl, message);
  }

  return sendMessage(chatId, message);
};
