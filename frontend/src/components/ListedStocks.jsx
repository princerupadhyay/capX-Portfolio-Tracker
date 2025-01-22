import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StockContext } from "../contexts/StockContext";
import Loading from "./Loading";
import { IconButton } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useMediaQuery } from "react-responsive";
import "../../styles/ListedStocks.css";

const ListedStocks = () => {
  const { stocks, prices, loading, error } = useContext(StockContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (loading || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleStockClick = (ticker) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/stocks/${ticker}`);
    }, 1000);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Listed Stocks</h1>
      <div className="stocks">
        {stocks.map((stock) => {
          const currentPrice = prices[stock.ticker]?.currentPrice;
          const openingPrice = stock.history[0].open;
          const gainLossPercentage = currentPrice
            ? ((currentPrice - openingPrice) / openingPrice) * 100
            : 0;
          const isGain = currentPrice > openingPrice;
          const isLoss = currentPrice < openingPrice;

          return (
            <div
              key={stock._id}
              className="stock"
              onClick={() => handleStockClick(stock.ticker)}
            >
              <img
                src={`https://capx-portfolio-tracker.onrender.com${stock.img.light}`}
                alt={`${stock.name} logo`}
                className="logo"
              />
              <div className="stock-details">
                <span className="stock-name">
                  {stock.name} ({stock.ticker}){" "}
                  <span className="stock-change">
                    {isGain && (
                      <IconButton
                        size="large"
                        sx={{
                          color: "green",
                          transform: "scale(2)",
                          cursor: "auto",
                          p: 0,
                          pr: 0.5,
                        }}
                      >
                        <ArrowDropUpIcon />
                      </IconButton>
                    )}
                    {isLoss && (
                      <IconButton
                        size="large"
                        sx={{
                          color: "red",
                          transform: "scale(2)",
                          cursor: "auto",
                          p: 0,
                          pr: 0.5,
                        }}
                      >
                        <ArrowDropDownIcon />
                      </IconButton>
                    )}
                    {!isGain && !isLoss && (
                      <span style={{ color: "grey" }}>---</span>
                    )}
                    {currentPrice && (
                      <span
                        style={{
                          color: isGain ? "green" : isLoss ? "red" : "grey",
                          fontSize: "1rem",
                        }}
                      >
                        ({gainLossPercentage.toFixed(2)}%)
                      </span>
                    )}
                  </span>
                </span>
                <span className="stock-price">
                  <span style={{ color: "grey" }}>
                    <strong>Current Price: </strong>
                  </span>{" "}
                  ${currentPrice || " ---"}
                </span>
                <span className="stock-price">
                  <span style={{ color: "grey" }}>
                    <strong>Opening Price: </strong>
                  </span>
                  ${openingPrice}
                </span>
                <span className="stock-price">
                  <span style={{ color: "grey" }}>
                    <strong>Total Volume: </strong>
                  </span>
                  $
                  {Intl.NumberFormat().format(
                    stock.history[0].volume.toFixed(0)
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListedStocks;
