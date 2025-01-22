import React from "react";
import Register from "../components/Register";
import "../../styles/RegisterPage.css";

export default function RegisterPage() {
  return (
    <div
      className="RegisterPage"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

      <div className="RegisterBox">
        <Register />
      </div>
    </div>
  );
}
