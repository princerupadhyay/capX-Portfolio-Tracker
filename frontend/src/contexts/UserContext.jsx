import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/auth/user");
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
