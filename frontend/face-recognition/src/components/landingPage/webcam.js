import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./webcam.module.css";
import { BsCameraVideo } from "react-icons/bs";
import { BsCameraVideoOff } from "react-icons/bs";
import { Link } from "react-router-dom";
import AttendanceModal from "./AttendanceModal";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WebcamCapture = () => {
  // Declaring variables
  const webcamRef = useRef(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [width, setWidth] = useState();
  const [widthWebcam, setWidthWebCam] = useState(740);
  const [heightWebCam, setHeightWebCam] = useState(416);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const navigate = useNavigate();

  const videoConstraints = {
    width: widthWebcam,
    height: heightWebCam,
    facingMode: "user",
  };

  // Handling the width and height of the webcam component
  useEffect(() => {
    setWidth(window.innerWidth);
  });
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [width]);

  useEffect(() => {
    if (width >= 1260) {
      setWidthWebCam(740);
      setHeightWebCam(416);
    } else if (width < 1350 && width > 925) {
      setWidthWebCam(width / 2);
      setHeightWebCam(width / (2 * 1.7794));
    } else if (width <= 925 && width >= 540) {
      setWidthWebCam(500);
      setHeightWebCam(400);
    } else if (width < 540) {
      setWidthWebCam(width - 40);
      setHeightWebCam(400);
    } else if (width < 400) {
      setWidthWebCam(width - 20);
      setHeightWebCam(400);
    }
  }, [width]);

  // Handling the capture of image using webcam object
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setTeamModalOpen(true);
  }, [webcamRef]);

  // Handling opening and closing of camera
  const changeWebcanConfig = () => {
    setWebcamEnabled(!webcamEnabled);
  };

  return (
    <div className={styles.container}>
      {teamModalOpen && <AttendanceModal setTeamModalOpen={setTeamModalOpen} imageSrc={imageSrc} />}
      <div className={styles.topContainer}>
        <div className={styles.iconContainer}>
          <FaUsers className={styles.icon} />
          <p className={styles.iconName}>Attendo</p>
        </div>
        <div className={styles.btnAdminContainer}>
          <button
            className={styles.btnAdmin}
            onClick={() => {
              navigate("/adminlogin");
            }}
          >
            Admin Pannel
          </button>
        </div>
      </div>
      <h1 className={styles.welcomeSmallScreen}>Welcome to Attendo</h1>
      <div className={styles.webCamContainer}>
        {!webcamEnabled ? (
          <div
            className={styles.webcamDisabledContainer}
            style={{
              width: widthWebcam,
              height: heightWebCam,
              background: "gray",
              borderRadius: "10px",
            }}
          ></div>
        ) : (
          <Webcam
            audio={false}
            height={heightWebCam}
            ref={webcamRef}
            mirrored="true"
            screenshotFormat="images/jpeg"
            width={widthWebcam}
            style={{ borderRadius: "10px", display: "block" }}
            videoConstraints={videoConstraints}
          />
        )}

        <button
          className={`${styles.changeWebcanConfig} ${webcamEnabled ? "" : styles.disabled}`}
          onClick={changeWebcanConfig}
        >
          {webcamEnabled ? (
            <BsCameraVideo style={{ color: "white", height: "24px", width: "24px" }} />
          ) : (
            <BsCameraVideoOff style={{ color: "white", height: "24px", width: "24px" }} />
          )}
        </button>
      </div>

      <div className={styles.rightContainer}>
        <h1 className={styles.welcome}>Welcome to Attendo</h1>
        <div className={styles.btnContainer}>
          <button
            onClick={() => (webcamEnabled ? capture() : alert("Please turn on your camera to mark your attendence"))}
            className={styles.btnAttendence}
          >
            Mark Attendence
          </button>

          <Link to="/login" className={styles.link}>
            <button className={styles.btnSeeAttendence}>See your Attendence</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
