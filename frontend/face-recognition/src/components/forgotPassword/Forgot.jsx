import React, { useState } from "react";
import styles from "./Forgot.module.css";
import axios from "axios";
import forgotImage from "../../assets/forgotImage.svg";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../Loader/Loader";
import { FaUsers } from "react-icons/fa";

const ForgotPassword = () => {
  //Declaring variables
  const [code, setCode] = useState(false);
  const [email, setEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(false);
  const [otpStatus, setOtpStatus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Declaring references to each otp box
  const textInput1 = React.useRef(null);
  const textInput2 = React.useRef(null);
  const textInput3 = React.useRef(null);
  const textInput4 = React.useRef(null);
  const textInput5 = React.useRef(null);
  const textInput6 = React.useRef(null);
  const box = [textInput1, textInput2, textInput3, textInput4, textInput5, textInput6];

  // Handling change of focus while input of otp box is filled
  function handleClick(from, to) {
    if (from.current.value.length) {
      to.current.focus();
    }
  }

  // Declaring a state and a corresponding function to check whether all otp boxes are filled
  const [isAllFilled, setIsAllFilled] = React.useState(false);
  const filledTest = () => {
    if (
      textInput1.current.value.length == 1 &&
      textInput2.current.value.length == 1 &&
      textInput3.current.value.length == 1 &&
      textInput4.current.value.length == 1 &&
      textInput5.current.value.length == 1 &&
      textInput6.current.value.length == 1
    ) {
      setIsAllFilled(true);
      return;
    }
    setIsAllFilled(false);
    return;
  };

  // Handling check for same password & confirm password
  const handleValidation = () => {
    if (
      typeof password === "undefined" ||
      password === "" ||
      password.toString().length > 50 ||
      8 > password.toString().length
    ) {
      enqueueSnackbar("Password should be minimum of 8 characters !!", {
        variant: "error",
      });
      return false;
    }
    if (password != confirmPassword) {
      enqueueSnackbar("Password mismatch, please fill again !!", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  // Handling function for sending the OTP
  const getOTPHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Call to backend api
    Promise.resolve(axios.post(process.env.REACT_APP_NODE_API_URL + "api/user/email/verify", { email }, config))
      .then((res) => {
        setOtpStatus("sent");
        setLoading(false);
        enqueueSnackbar("OTP sent successfully", {
          variant: "success",
        });
      })
      .catch((e) => {
        // Handling errors
        if (e.response) {
          enqueueSnackbar("This email is not registered with us", {
            variant: "error",
          });
        }
        setLoading(false);
      });
  };

  //Function to submit the otp and save it value in state
  const submitOTPHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    // Checking all fields filled or not
    if (!isAllFilled) {
      setLoading(false);
      enqueueSnackbar("Please fill all the fields", {
        variant: "error",
      });
    } else {
      setCode(
        textInput1.current.value +
          textInput2.current.value +
          textInput3.current.value +
          textInput4.current.value +
          textInput5.current.value +
          textInput6.current.value
      );
      setLoading(false);
      setOtpStatus(true);
    }
  };

  // Function to set new password for the user
  const newPasswordHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (handleValidation()) {
      const config = {
        headers: {
          Accept: "application/json",
        },
      };
      const data = {
        email: email,
        otp: parseInt(code),
        password: password,
      };

      // Calling the backend API
      Promise.resolve(axios.post(process.env.REACT_APP_NODE_API_URL + "api/user/forgot/password", data, config))
        .then((res) => {
          setLoading(false);
          enqueueSnackbar("Password reset Successfully.", {
            variant: "success",
          });
          navigate("/login");
        })
        .catch((e) => {
          // Handling errors
          if (e.response) {
            if (e.response.data.message == "invalid OTP !") {
              enqueueSnackbar("OTP entered is invalid. Please try again", {
                variant: "error",
              });
              setOtpStatus("sent");
            }
            enqueueSnackbar(e.response.data.message, {
              variant: "error",
            });
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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
            <img src={forgotImage} alt="signin" className={styles.image} />
          </div>
          <div className={styles.formContainer}>
            <div className={styles.container}>
              <div className={styles.iconContainerSmallScreen} onClick={() => navigate("/")}>
                <FaUsers className={styles.icon} />
                <p className={styles.iconName}>Attendo</p>
              </div>
              <div className={styles.formTitleContainer}>
                <h1 className={styles.formTitle}>Forgot Password</h1>
              </div>

              {/* Email Form */}
              {otpStatus == false && (
                <form onSubmit={getOTPHandler}>
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
                  <div className={styles.submitBtnContainer}>
                    <button className={styles.signInbtn}>Get OTP</button>
                  </div>
                </form>
              )}

              {/* OTP Form */}
              {otpStatus == "sent" && (
                <form onSubmit={submitOTPHandler}>
                  <label className={styles.inputLabel}>Enter your OTP</label>
                  <div className={styles.inputBox}>
                    <div className={styles.otpInput}>
                      {box.map((obj, index) => {
                        return index < 5 ? (
                          <input
                            autoComplete="on"
                            type="text"
                            key={index}
                            ref={box[index]}
                            maxLength="1"
                            className={styles.otpValueRecovery}
                            onKeyUp={() => {
                              handleClick(obj, box[index + 1]);
                              filledTest();
                            }}
                            required
                          />
                        ) : (
                          <input
                            autoComplete="on"
                            type="text"
                            key={index}
                            ref={box[index]}
                            maxLength="1"
                            className={styles.otpValueRecovery}
                            onKeyUp={() => {
                              filledTest();
                            }}
                            required
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.submitBtnContainer}>
                    <button className={styles.signInbtn}>Submit OTP</button>
                  </div>
                </form>
              )}

              {/* New Password Form */}
              {otpStatus == true && (
                <form onSubmit={newPasswordHandler}>
                  <label className={styles.inputLabel}>New Password</label>
                  <div className={styles.inputBox}>
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      required
                      className={styles.input}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength="8"
                      maxLength="50"
                    />
                  </div>

                  <label className={styles.inputLabel}>Confirm Password</label>
                  <div className={styles.inputBox}>
                    <input
                      type="password"
                      placeholder="Re-Enter your new Password"
                      required
                      className={styles.input}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className={styles.submitBtnContainer}>
                    <button className={styles.signInbtn}>Submit</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
