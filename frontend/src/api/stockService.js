import axios from "axios";

// Define the base URL for the API
const API_BASE_URL = "https://capx-portfolio-tracker.onrender.com"; // Update as needed for your backend

// Function to retrieve the JWT token from localStorage
const getToken = () => {
    return localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
};

// Set Authorization header with Bearer token if available
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch stock info by ticker
export const fetchStockData = async (ticker) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        // Making an API call to fetch stock info
        const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}`, { headers });
        return response.data; // Return the stock data
    } catch (error) {
        console.error("Error fetching stock data:", error);
        throw new Error("Failed to fetch stock data");
    }
};

// Fetch all stocks info
export const fetchAllStocks = async () => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/stocks`, { headers });
        return response.data; // Return the array of stocks data
    } catch (error) {
        console.error("Error fetching all stocks:", error);
        throw new Error("Failed to fetch all stocks data");
    }
};

// Fetch stock price by ticker
export const fetchStockPrice = async (ticker) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}/price`, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching stock price:", error);
        throw new Error("Failed to fetch stock price");
    }
};
