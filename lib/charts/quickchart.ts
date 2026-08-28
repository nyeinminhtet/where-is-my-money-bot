interface CategoryData {
  category: string;
  amount: number;
}

const formatCompactNumber = (value: number): string => {
  if (value === 0) return "";
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(0) + "k";
  return String(value);
};

export const generateCategoryChartUrl = (data: CategoryData[]): string => {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  const total = sortedData.reduce((sum, item) => sum + item.amount, 0);

  // Combine category name, compact amount, and percentage into one label.
  const formattedLabels = sortedData.map((item) => {
    const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0;
    const formattedVal = formatCompactNumber(item.amount) || "0";
    return `${item.category}: ${formattedVal} (${percentage}%)`;
  });

  const amounts = sortedData.map((item) => item.amount);

  const chartConfig = {
    type: "pie",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#B0BEC5",
            "#81C784",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            font: { size: 13 },
            boxWidth: 15,
            padding: 12,
          },
        },
        datalabels: {
          display: false,
        },
      },
    },
  };

  const url = `https://quickchart.io/chart?v=3&c=${encodeURIComponent(
    JSON.stringify(chartConfig),
  )}&w=850&h=450&bkg=white`;
  return url;
};

interface MonthlyBreakdown {
  month: number | string;
  income: number;
  expense: number;
  hasData?: boolean;
}

export const generateYearlyBarChartUrl = (
  data: MonthlyBreakdown[],
  year: number | string,
): string => {
  const activeData = data.filter(
    (m) => m.hasData || m.income > 0 || m.expense > 0,
  );

  const labels = activeData.map((m) => `${m.month}လပိုင်း`);
  const incomes = activeData.map((m) => m.income);
  const expenses = activeData.map((m) => m.expense);

  const chartConfig = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "ဝင်ငွေ",
          data: incomes,
          backgroundColor: "#2ECC71",
          borderRadius: 4,
        },
        {
          label: "ထွက်ငွေ",
          data: expenses,
          backgroundColor: "#FF6384",
          borderRadius: 4,
        },
      ],
    },
    options: {
      layout: {
        padding: 20,
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: { size: 13, weight: "bold" },
            boxWidth: 15,
          },
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          font: { size: 10, weight: "bold" },
          color: "#333",
          formatter: formatCompactNumber,
        },
        title: {
          display: true,
          text: `${year} လအလိုက် ဝင်ငွေ / ထွက်ငွေ နှိုင်းယှဉ်ချက်`,
          font: { size: 16, bold: true },
          padding: { bottom: 15 },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value),
          },
        },
      },
    },
  };

  const url = `https://quickchart.io/chart?v=3&c=${encodeURIComponent(
    JSON.stringify(chartConfig),
  )}&w=800&h=450&bkg=white`;
  return url;
};
