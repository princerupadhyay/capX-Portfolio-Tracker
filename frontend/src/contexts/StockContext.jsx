import { createContext, useState, useEffect } from "react";
import { fetchAllStocks, fetchStockPrice } from "../api/stockService";

// Add the JWT token retrieval logic here
const getToken = () => {
  return localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
};

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

        const token = getToken(); // Retrieve token from localStorage

        const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Add token to headers if available

        // Fetch stocks with authorization headers (JWT)
        const fetchedStocks = await fetchAllStocks(headers);
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
          const price = await fetchStockPrice(stock.ticker, headers); // Pass headers to fetch stock price
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
