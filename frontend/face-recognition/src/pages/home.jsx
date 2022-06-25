import React from "react";
import Navbar from "../components/navbar/Navbar";
import WebCam from "../components/landingPage/webcam";
import Timeline from "../components/landingPage/Timeline";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        width: "100vw",
        // justifyContent: "center",
        backgroundColor: "#140536"
      }}
    >
      {/* <Navbar pageType="Normal"/> */}
      <WebCam />
      <Timeline />
    </div>
  );
};

export default Home;
