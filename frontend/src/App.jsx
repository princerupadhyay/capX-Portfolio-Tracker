import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserProvider } from "./contexts/UserContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
