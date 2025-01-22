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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/user", {
          withCredentials: true,
        });
        const user = response.data.user;
        setUserId(user._id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const intervalId = setInterval(() => {
      if (!userId) {
        fetchUserInfo();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

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

    fetchNotifications();
  }, [userId]);

  const addNotification = async (message, action) => {
    if (userId) {
      try {
        await saveNotification(userId, message, action);
        const updatedNotifications = await getNotifications(userId);
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error adding notification:", error);
      }
    }
  };

  const clearAllNotifications = async () => {
    if (userId) {
      try {
        await clearNotifications(userId);
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearAllNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
