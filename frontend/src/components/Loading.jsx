import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
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
};

export default Loading;
