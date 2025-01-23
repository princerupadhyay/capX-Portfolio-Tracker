import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info function with JWT authentication
  const fetchUserInfo = async () => {
    try {
      // Retrieve token from localStorage (or cookies/sessionStorage)
      const token = localStorage.getItem("authToken");

      if (!token) {
        return { username: "Guest" }; // Default user if no token
      }

      // Set the token in the Authorization header for protected route
      const response = await axios.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { username: "Guest" };
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
      setLoading(false);
    };

    getUserInfo();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};
