import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import signinImage from "../../assets/signInImage.svg";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../Loader/Loader";
import { FaUsers } from "react-icons/fa";

const Login = ({ pageType }) => {
  // Declaring variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Function to handle Login(SignIn)
  const loginHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Call to the backend API
    Promise.resolve(
      axios.post(
        process.env.REACT_APP_NODE_API_URL + "api/user/login",
        {
          email,
          password,
        },
        config
      )
    )
      .then((res) => {
        // Storing values to local storage
        localStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token);
        localStorage.setItem("userId", res.data.id);
        enqueueSnackbar("Logged in successfully", {
          variant: "success",
        });
        setLoading(false);
        navigate(pageType == "Admin" ? "/department" : `/userprofile/${res.data.id}`);
      })
      .catch((err) => {
        // Handling errors
        let message = err.response.data.message;
        enqueueSnackbar(message, {
          variant: "error",
        });
        setLoading(false);
        navigate(pageType == "Admin" ? "/" : "");
      });
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {loading && <Loader />}
        <div className={styles.innerContainer}>
          <div className={styles.imageContainerSignIn}>
            <div className={styles.iconContainer} onClick={() => navigate("/")}>
              <FaUsers className={styles.icon} />
              <p className={styles.iconName}>Attendo</p>
            </div>
            <img src={signinImage} alt="signin" className={styles.image} />
          </div>
          <div className={styles.formContainer}>
            <div className={styles.container}>
              <div className={styles.iconContainerSmallScreen} onClick={() => navigate("/")}>
                <FaUsers className={styles.icon} />
                <p className={styles.iconName}>Attendo</p>
              </div>
              <div className={styles.formTitleContainer}>
                <h1 className={styles.formTitle}>Login{pageType == "Admin" ? " as Admin" : ""} </h1>
              </div>
              <form onSubmit={loginHandler}>
                <label className={styles.inputLabel}>Email</label>
                <div className={styles.inputBox}>
                  <input
                    type="email"
                    placeholder="abc@gmail.com"
                    required
                    className={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <label className={styles.inputLabel}>Password</label>
                <div className={styles.inputBox}>
                  <input
                    type="password"
                    placeholder="Enter your Password"
                    required
                    className={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.forgotPassword}>
                  <p className={styles.forgotText} onClick={() => navigate("/recoverpassword")}>
                    Forgot Password
                  </p>
                </div>
                <div className={styles.submitBtnContainer}>
                  <button className={styles.signInbtn}>Sign In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
