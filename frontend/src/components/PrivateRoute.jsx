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
        const response = await axios.get(
          "https://capx-portfolio-tracker.onrender.com/auth/checkAuth",
          { withCredentials: true }
        );
        console.log("checkAuth Response: ", response);
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
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
