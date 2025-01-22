import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import UserProfilePage from "../pages/UserProfilePage";
import PageNotFound from "../pages/PageNotFound";
import PrivateRoute from "../components/PrivateRoute";
import StockInfo from "../components/StockInfo";
import ListedStocks from "../components/ListedStocks";
import { StockProvider } from "../contexts/StockContext";
import Marquee from "react-fast-marquee";
import MarqueeStock from "../components/MarqueeStock";
import Navbar from "../components/Navbar";
import BottomAppBar from "../components/BottomAppBar";
import { useMediaQuery, useTheme } from "@mui/material";

const AppRoutes = () => {
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  return (
    <>
      {![
        "/",
        "/login",
        "/register",
        "/stocks",
        "/stocks/:ticker",
        "/profile",
      ].includes(location.pathname) && (
        <Marquee>
          <StockProvider>
            <MarqueeStock />
          </StockProvider>
        </Marquee>
      )}

      <Navbar toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute Component={Dashboard} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute Component={UserProfilePage} />}
        />

        {/* Stock Info Route */}
        <Route
          path="/stocks"
          element={
            <StockProvider>
              <ListedStocks />
            </StockProvider>
          }
        />
        <Route
          path="/stocks/:ticker"
          element={
            <StockProvider>
              <StockInfo />
            </StockProvider>
          }
        />

        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Catch-all Route for 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {isMobile && (
        <StockProvider>
          <BottomAppBar></BottomAppBar>
        </StockProvider>
      )}
    </>
  );
};

export default AppRoutes;
