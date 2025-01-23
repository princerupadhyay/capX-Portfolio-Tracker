import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "../../axiosConfig";
import Loading from "./Loading";

const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        const response = await axios.get("/auth/checkAuth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response indicates the user is authenticated
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        // If there's an error (e.g., token expired, invalid), user is not authenticated
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    console.log(`Redirecting to /login?redirect=${location.pathname}`);
    return <Navigate to={`/login?redirect=${location.pathname}`} />;
  }

  return <Component />;
};

export default PrivateRoute;
