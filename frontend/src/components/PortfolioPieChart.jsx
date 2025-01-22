import React from "react";
import Chart from "react-apexcharts";

const PortfolioPieChart = ({ stocks }) => {
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: stocks.map((item) => item.ticker),
    legend: {
      position: "bottom",
      labels: {
        colors: "#fff",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            labels: {
              colors: "#fff",
            },
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}%`,
      },
    },
  };

  const chartSeries = stocks.map((item) => item.purchaseAmount);

  return (
    <div className="portfolio-pie-chart">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={420}
      />
    </div>
  );
};

export default PortfolioPieChart;
