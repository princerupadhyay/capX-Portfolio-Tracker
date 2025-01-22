import axios from 'axios';

const API_BASE_URL = 'https://capx-portfolio-tracker.onrender.com/portfolio';

// Fetch all stocks
export const getPortfolio = async () => {
    const response = await axios.get(`${API_BASE_URL}/`, { withCredentials: true });
    return response.data.stocks;
};

// Add a new stock
export const addStock = async (stock) => {
    const response = await axios.post(`${API_BASE_URL}/`, stock, { withCredentials: true });
    return response.data.stock;
};

// Update a stock
export const updateStock = async (id, stock) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, stock, { withCredentials: true });
    return response.data.stock;
};

// Delete a stock
export const deleteStock = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
    return response.data;
};

// Get total portfolio value
export const getPortfolioValue = async () => {
    const response = await axios.get(`${API_BASE_URL}/value`, { withCredentials: true });
    return response.data.totalValue;
};

// Fetch stock price
export const fetchStockPrice = async (ticker) => {
    const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}/price`, { withCredentials: true });
    return response.data;
};