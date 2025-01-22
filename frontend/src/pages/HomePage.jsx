import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("authToken");

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('./bg.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.15,
              zIndex: -1,
            }}
          ></div>
          <h1>Welcome to CapX.live</h1>
          <br />
          {!isLoggedIn && (
            <div>
              <Button
                variant="outlined"
                onClick={() => handleNavigation("/login")}
                style={{ marginRight: "10px" }}
                sx={{
                  borderRadius: "1.25rem",
                  borderColor: "grey",
                  textTransform: "none",
                  pl: 3,
                  pr: 3,
                  "&:hover": {
                    backgroundColor: "lightgrey",
                    borderColor: "black",
                    color: "black",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleNavigation("/register")}
                sx={{
                  borderRadius: "1.25rem",
                  borderColor: "grey",
                  textTransform: "none",
                  p1: 1,
                  "&:hover": {
                    backgroundColor: "lightgrey",
                    borderColor: "black",
                    color: "black",
                  },
                }}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
