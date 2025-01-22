import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Chart from "react-apexcharts";
import { StockContext } from "../contexts/StockContext";
import "../../styles/StockInfo.css";

const StockInfo = () => {
  const { ticker } = useParams();
  const { stocks, prices, loading, error } = useContext(StockContext);
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const selectedStock = stocks.find((s) => s.ticker === ticker);
    if (selectedStock) {
      setStock({
        ...selectedStock,
        price: prices[ticker],
      });
    } else {
      setStock(null);
    }
  }, [ticker, stocks, prices]);

  if (loading) return <Loading />;
  if (error) return <h2>{error}</h2>;
  if (!stock) return <h2>Stock not found</h2>;

  const chartOptions = {
    chart: {
      type: "area",
      id: "stock-history-chart",
      toolbar: {
        show: true,
        tools: {
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      selection: {
        enabled: true,
        type: "x",
      },
    },
    xaxis: {
      type: "datetime",
      categories: stock.history.map((entry) => entry.date),
      labels: {
        style: {
          colors: "#8e8da4",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Closing Price (USD)",
        style: {
          color: "#8e8da4",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          colors: "#8e8da4",
          fontSize: "12px",
        },
      },
    },
    title: {
      text: `${stock.name} (${stock.ticker}) Price History`,
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val) => `$${val.toFixed(2)}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#8e8da4",
      },
    },
  };

  const chartSeries = [
    {
      name: "Closing Price",
      data: stock.history.map((entry) => entry.close),
    },
  ];

  return (
    <div className="stock-info">
      <div className="stock-info-card">
        <div className="stock-header">
          <img
            src={`http://localhost:3000${stock.img.light}`}
            alt={`${stock.name} logo`}
            className="stock-logo"
          />
          <h2>
            {stock.name} <span>({stock.ticker})</span>
          </h2>
        </div>
        <div className="stock-details">
          <p>
            <strong>Description:</strong> {stock.description}
          </p>
          <p>
            <strong>Year Founded:</strong> {stock.yearFounded}
          </p>
          <p>
            <strong>Sector:</strong> {stock.sector}
          </p>
          <p>
            <strong>Industry:</strong> {stock.industry}
          </p>
          <p>
            <strong>Market Cap:</strong> ${stock.marketCap.toLocaleString()}
          </p>
          <p>
            <strong>Website: </strong>
            <a href={stock.website} target="_blank" rel="noopener noreferrer">
              {stock.website}
            </a>
          </p>
          <p>
            <strong>Country:</strong> {stock.country}
          </p>
        </div>
      </div>

      <div className="stock-chart">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default StockInfo;
