import axios from "axios";

// Define the base URL for the API
const API_BASE_URL = "http://localhost:3000"; // Update as needed for your backend

// Fetch stock info by ticker
export const fetchStockData = async (ticker) => {
    try {
        // Making an API call to fetch stock info
        const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}`, { withCredentials: true });
        return response.data; // Return the stock data
    } catch (error) {
        console.error("Error fetching stock data:", error);
        throw new Error("Failed to fetch stock data");
    }
};

// Fetch all stocks info
export const fetchAllStocks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stocks`, { withCredentials: true });
        return response.data; // Return the array of stocks data
    } catch (error) {
        console.error("Error fetching all stocks:", error);
        throw new Error("Failed to fetch all stocks data");
    }
};

export const fetchStockPrice = async (ticker) => {
    const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}/price`, { withCredentials: true });
    return response.data;
};
