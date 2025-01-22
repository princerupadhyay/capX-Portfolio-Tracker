import { useContext } from "react";
import { StockContext } from "../contexts/StockContext";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";

const MarqueeStock = () => {
  const { stocks, prices } = useContext(StockContext);

  return (
    <Link
      to="/stocks"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {stocks.map((stock, index) => {
          const currentPrice = prices[stock.ticker]?.currentPrice;
          const openingPrice = stock?.history[0].open;

          const gainLossPercentage = currentPrice
            ? ((currentPrice - openingPrice) / openingPrice) * 100
            : 0;
          const isGain = currentPrice > openingPrice;
          const isLoss = currentPrice < openingPrice;

          return (
            <span
              key={stock.ticker}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>{stock.ticker}</span>
              {isGain && (
                <ArrowDropUpIcon
                  style={{
                    color: "green",
                  }}
                />
              )}
              {isLoss && (
                <ArrowDropDownIcon
                  style={{
                    color: "red",
                  }}
                />
              )}
              <span>{gainLossPercentage.toFixed(2)}%</span>
              {index !== stocks.length - 1 && (
                <span style={{ margin: "0 0.5rem" }}>&nbsp;•</span>
              )}
            </span>
          );
        })}
      </div>
    </Link>
  );
};

export default MarqueeStock;
