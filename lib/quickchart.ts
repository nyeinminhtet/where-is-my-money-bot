interface CategoryData {
  category: string;
  amount: number;
}

export const generateCategoryChartUrl = (data: CategoryData[]): string => {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  const total = sortedData.reduce((sum, item) => sum + item.amount, 0);

  // 🟢 Category Name, Amount (k) နဲ့ % ကို Label တစ်ခုတည်းမှာ ပေါင်းစပ်ခြင်း
  const formattedLabels = sortedData.map((item) => {
    const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0;
    const formattedVal =
      item.amount >= 1000 ? (item.amount / 1000).toFixed(0) + "k" : item.amount;

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
            "#FF6384", // မိသားစု
            "#36A2EB", // အစားအသောက်
            "#FFCE56", // အခြား
            "#4BC0C0", // ကျန်းမာရေး
            "#9966FF", // ဖျော်ဖြေရေး
            "#FF9F40", // သွားလာရေး
            "#B0BEC5", // ဈေးဝယ်ခြင်း
            "#81C784", // မီး/ရေ/အင်တာနက်
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      // 🟢 Chart.js Version Compatibility အတွက် Legend configuration အမှန်
      legend: {
        display: true,
        position: "right", // ညာဘက်သို့ ဒေါင်လိုက်ရွှေ့မည်
        labels: {
          fontSize: 13,
          boxWidth: 15,
          padding: 12,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "right", // v3/v4 plugins အတွက်ပါ ထပ်ထည့်ပေးထားသည်
          labels: {
            font: {
              size: 13,
            },
            boxWidth: 15,
            padding: 12,
          },
        },
        datalabels: {
          display: false, // Pie slice ပေါ်က စာသားများကို ပိတ်ထားသည်
        },
      },
    },
  };

  // QuickChart API (version 2.9 သို့မဟုတ် 3 ကို သေချာအောင် ခေါ်ဆိုခြင်း)
  return `https://quickchart.io/chart?v=3&c=${encodeURIComponent(
    JSON.stringify(chartConfig),
  )}&w=850&h=450&bkg=white`;
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
          backgroundColor: "#2ECC71", // အစိမ်းရောင်
          borderRadius: 4,
        },
        {
          label: "ထွက်ငွေ",
          data: expenses,
          backgroundColor: "#FF6384", // အနီ/ပန်းရောင်
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
          formatter: (value: number) => {
            if (value === 0) return "";
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M"; // ဥပမာ- 1.4M
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + "k"; // ဥပမာ- 1127k
            }
            return value;
          },
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
            callback: (value: number) => {
              if (value >= 1000) return (value / 1000).toFixed(0) + "k";
              return value;
            },
          },
        },
      },
    },
  };

  return `https://quickchart.io/chart?v=3&c=${encodeURIComponent(
    JSON.stringify(chartConfig),
  )}&w=800&h=450&bkg=white`;
};
