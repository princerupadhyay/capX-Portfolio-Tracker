import axios from 'axios';

const API_BASE_URL = 'https://capx-portfolio-tracker.onrender.com/notification';

// Function to retrieve the JWT token from localStorage
const getToken = () => {
    return localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
};

// Set Authorization header with Bearer token if available
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// API to save a notification
export const saveNotification = async (userId, message, type) => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers

        await axios.post(`${API_BASE_URL}/save`, {
            userId,
            message,
            type,
        }, { headers }); // Include headers in the request
    } catch (error) {
        console.error('Error saving notification:', error);
    }
};

// API to get notifications for a user
export const getNotifications = async () => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers
        const response = await axios.get(`${API_BASE_URL}/`, { headers });
        return response.data.notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

// API to clear all notifications for a user
export const clearNotifications = async () => {
    try {
        const headers = getAuthHeaders(); // Get the auth headers

        await axios.delete(`${API_BASE_URL}/`, { headers });
        console.log('All notifications cleared!');
    } catch (error) {
        console.error('Error clearing notifications:', error);
    }
};
