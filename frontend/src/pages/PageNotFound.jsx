import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function PageNotFound() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Oops!</h1>
      <h2 style={{ marginTop: "1rem" }}>Page Not Found (404)</h2>
      <a
        href="#"
        onClick={handleRedirect}
        style={{
          color: "green",
          textDecoration: "none",
          marginTop: "1rem",
          border: "1px solid white",
          padding: "1rem",
          borderRadius: "1.5rem",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "green";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderColor = "green";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "green";
          e.currentTarget.style.borderColor = "white";
        }}
      >
        Go to Home
      </a>
    </div>
  );
}
