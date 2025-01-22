import axios from 'axios';

const API_BASE_URL = 'https://capx-portfolio-tracker.onrender.com/notification';

// API to save a notification
export const saveNotification = async (userId, message, type) => {
    try {
        await axios.post(`${API_BASE_URL}/save`, {
            userId,
            message,
            type,
        });
    } catch (error) {
        console.error('Error saving notification:', error);
    }
};

// API to get notifications for a user
export const getNotifications = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data.notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

// API to clear all notifications for a user
export const clearNotifications = async (userId) => {
    try {
        await axios.delete(`${API_BASE_URL}/${userId}`);
        console.log('All notifications cleared!');
    } catch (error) {
        console.error('Error clearing notifications:', error);
    }
};
