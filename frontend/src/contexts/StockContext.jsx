import { createContext, useState, useEffect } from "react";
import { fetchAllStocks, fetchStockPrice } from "../api/stockService";

export const StockContext = createContext();

const PRICE_REFRESH_INTERVAL = 600000;

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        const fetchedStocks = await fetchAllStocks();
        setStocks(fetchedStocks);

        const savedPrices = JSON.parse(localStorage.getItem("stockPrices"));
        const lastUpdated = localStorage.getItem("lastUpdated");

        if (savedPrices && lastUpdated) {
          const now = Date.now();
          const timeDifference = now - parseInt(lastUpdated, 10);

          if (timeDifference < PRICE_REFRESH_INTERVAL) {
            setPrices(savedPrices);
            setLoading(false);
            return;
          }
        }

        const stockPrices = {};
        for (const stock of fetchedStocks) {
          const price = await fetchStockPrice(stock.ticker);
          stockPrices[stock.ticker] = price;
        }

        localStorage.setItem("stockPrices", JSON.stringify(stockPrices));
        localStorage.setItem("lastUpdated", Date.now().toString());

        setPrices(stockPrices);
      } catch (err) {
        setError("API Limit Exceeded, Please try again later!");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();

    const intervalId = setInterval(fetchStockData, PRICE_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <StockContext.Provider value={{ stocks, prices, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};
