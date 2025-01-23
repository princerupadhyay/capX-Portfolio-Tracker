import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import {
  getNotifications,
  saveNotification,
  clearNotifications,
} from "../api/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  // Poll userId every second until it is fetched
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        const user = response.data.user;
        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const interval = setInterval(() => {
      if (!userId) {
        fetchUserInfo(); // Keep polling until userId is fetched
      }
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup on unmount
    };
  }, [userId]); // Dependency on userId to stop polling once fetched

  // Fetch notifications once userId is fetched
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const fetchedNotifications = await getNotifications(userId);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    if (userId) {
      fetchNotifications(); // Fetch notifications once userId is available
    }
  }, [userId]); // Only run when userId changes

  // Add a new notification
  const addNotification = async (message, action) => {
    const token = localStorage.getItem("authToken");
    if (userId && token) {
      try {
        await saveNotification(userId, message, action, token);
        const updatedNotifications = await getNotifications(userId);
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error adding notification:", error);
      }
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (userId && token) {
      try {
        await clearNotifications(userId, token);
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
