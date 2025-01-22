import React from "react";
import Login from "../components/Login";
import "../../styles/LoginPage.css";
import { ErrorBoundary } from "react-error-boundary";

export default function LoginPage() {
  return (
    <div
      className="LoginPage"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Image Overlay */}
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

      <div className="LoginBox">
        <ErrorBoundary>
          <Login />
        </ErrorBoundary>
      </div>
    </div>
  );
}
