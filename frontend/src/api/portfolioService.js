import axios from 'axios';

const API_BASE_URL = 'https://capx-portfolio-tracker.onrender.com/portfolio';

// Function to retrieve the JWT token from localStorage
const getToken = () => {
    return localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
};

// Set Authorization header with Bearer token if available
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all stocks
export const getPortfolio = async () => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/`, { headers });
        return response.data.stocks;
    } catch (error) {
        console.error('Error fetching portfolio:', error);
    }
};

// Add a new stock
export const addStock = async (stock) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.post(`${API_BASE_URL}/`, stock, { headers });
        return response.data.stock;
    } catch (error) {
        console.error('Error adding stock:', error);
    }
};

// Update a stock
export const updateStock = async (id, stock) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.put(`${API_BASE_URL}/${id}`, stock, { headers });
        return response.data.stock;
    } catch (error) {
        console.error('Error updating stock:', error);
    }
};

// Delete a stock
export const deleteStock = async (id) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error deleting stock:', error);
    }
};

// Get total portfolio value
export const getPortfolioValue = async () => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/value`, { headers });
        return response.data.totalValue;
    } catch (error) {
        console.error('Error fetching portfolio value:', error);
    }
};

// Fetch stock price
export const fetchStockPrice = async (ticker) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}/price`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching stock price:', error);
    }
};
