import React from "react";
import { ThreeDots } from "react-loader-spinner";

const DefaultLoading = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <ThreeDots
        visible={true}
        height="20"
        width="60"
        color="white"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

const SmallLoadingDark = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3.5rem",
      }}
    >
      <ThreeDots
        visible={true}
        height="15"
        width="45"
        color="black"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

const SmallLoadingLight = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3.5rem",
      }}
    >
      <ThreeDots
        visible={true}
        height="15"
        width="45"
        color="white"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

const BigLoading = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThreeDots
        visible={true}
        height="30"
        width="90"
        color="white"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

const DarkLoading = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
      }}
    >
      <ThreeDots
        visible={true}
        height="20"
        width="60"
        color="white"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

const LightLoading = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
      }}
    >
      <ThreeDots
        visible={true}
        height="20"
        width="60"
        color="black"
        radius="2"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
});

export {
  DefaultLoading,
  SmallLoadingDark,
  SmallLoadingLight,
  BigLoading,
  DarkLoading,
  LightLoading,
};
