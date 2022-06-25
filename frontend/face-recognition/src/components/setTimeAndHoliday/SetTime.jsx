import React, { useState, useEffect } from "react";
import styles from "./SetTime.module.css";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const SetTime = () => {
  // Declaring variables
  const [currTime, setCurrTime] = useState(10);
  const [time, setTime] = useState("");
  const [isCurrExist, setIsCurrExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Initializing the time array
  const timeArr = [
    "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00",
    "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"
  ];

  // Getting the current setted attendence time at time of page load
  useEffect(() => {
    setLoading(true);

    try {
      // Function which handle the request and handle the request in case access token is expired
      const getdata = (requestCount) => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");
        if (atoken) {
          const config = {
            headers: {
              Authorization: `Bearer ${atoken}`,
            },
          };

          Promise.resolve(axios.get(process.env.REACT_APP_NODE_API_URL + "api/get/attendancetime", config))
            .then((res) => {
              if (res.data.attendanceTime.attendanceTime != "") {
                setIsCurrExist(true);
                setCurrTime(res.data.attendanceTime.attendanceTime);
              }
              setLoading(false);
              return;
            })
            .catch((error) => {
              // In case if access token has expired
              if (error.response && error.response.status === 401 && requestCount == 0) {
                axios
                  .post(process.env.REACT_APP_NODE_API_URL + "api/user/refresh", {
                    refresh_token: rtoken,
                  })
                  .then((res) => {
                    localStorage.setItem("accessToken", res.data.access_token);
                    localStorage.setItem("refreshToken", res.data.refresh_token);
                    getdata(1);
                    return;
                  })
                  .catch((error) => {
                    enqueueSnackbar("You are not logged in", {
                      variant: "error",
                    });
                    setLoading(false);
                    window.localStorage.clear();
                    navigate("/");
                    return;
                  });
              } else if (error.response && error.response.status === 401 && requestCount > 0) {
                // Handling erros when user is not admin
                enqueueSnackbar("You are not an admin", {
                  variant: "error",
                });
                window.localStorage.clear();
                navigate("/");
                setLoading(false);
              }else if (error.response && error.response.status === 400) {
                // No current holiday set
                setLoading(false);
              }else {
                // Handling erros except when access token is expired
                setLoading(false);
              }
            });
        } else {
          // No access token available in local storage
          enqueueSnackbar("You need to login first", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          navigate("/");
          return;
        }
      };

      // Calling the above function
      getdata(0);
      return;
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      navigate("/");
      return;
    }
  }, []);

  // Function to set or update the date(same as above with axios method = post)
  const submitHandler = (e, functionType) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Function which handle the request and handle the request in case access token is expired
      const getdata = (requestCount) => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");
        if (atoken) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${atoken}`,
            },
          };

          Promise.resolve(
            axios.post(
              process.env.REACT_APP_NODE_API_URL + "api/" + functionType + "/attendancetime",
              {
                attendanceTime: time,
              },
              config
            )
          )
            .then((res) => {
              enqueueSnackbar("Attendance Time " + functionType + "ed successfully", {
                variant: "success",
              });
              setLoading(false);
              return;
            })
            .catch((error) => {
              // In case if access token has expired
              if (error.response && error.response.status === 401 && requestCount == 0) {
                axios
                  .post(process.env.REACT_APP_NODE_API_URL + "api/user/refresh", {
                    refresh_token: rtoken,
                  })
                  .then((res) => {
                    localStorage.setItem("accessToken", res.data.access_token);
                    localStorage.setItem("refreshToken", res.data.refresh_token);
                    getdata(1);
                    return;
                  })
                  .catch((error) => {
                    enqueueSnackbar("You are not logged in", {
                      variant: "error",
                    });
                    setLoading(false);
                    window.localStorage.clear();
                    navigate("/");
                    return;
                  });
              } else if (error.response && error.response.status === 401 && requestCount > 0) {
                // Handling erros when user is not admin
                enqueueSnackbar("You are not an admin", {
                  variant: "error",
                });
                window.localStorage.clear();
                navigate("/");
                setLoading(false);
              }else {
                // Handling erros except when access token is expired
                enqueueSnackbar("Some error occurred. Please try again", {
                  variant: "error",
                });
                setLoading(false);
              }
            });
        } else {
          // No access token available in local storage
          enqueueSnackbar("You need to login first", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          navigate("/");
          return;
        }
      };

      // Calling the above function
      getdata(0);
      return;
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      navigate("/");
      return;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.mainTimeContainer}>
        <div className={styles.headingTime}>Set Attendence Time</div>
        <div className={styles.container}>
          {isCurrExist && (
            <div className={styles.currentTimeContainer}>
              <h1 className={styles.currTimeText}>Current Attendence time </h1>
              <p className={styles.currentTime}>{currTime}:00 Hours</p>
            </div>
          )}
          {!isCurrExist && (
            <div className={styles.setTimeContainer}>
              <h1 className={styles.labelTime}>Set the attendence Time(24-hr Format)(HH)</h1>
              <form className={styles.form} onSubmit={(e) => submitHandler(e, "set")}>
                <select
                  className={styles.select}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                >
                  <option value="" hidden className={styles.disabledOption}>
                    Select
                  </option>
                  {timeArr.map((e, i) => {
                    return (
                      <option key={e} value={i} className={styles.option}>
                        {e}
                      </option>
                    );
                  })}
                </select>

                <input type="submit" className={styles.submitTime} value="Set Time" />
              </form>
            </div>
          )}
          {isCurrExist && (
            <div className={styles.updateTimeContainer}>
              <hr className={styles.separator} />
              <h1 className={styles.labelTime}>Update the Attendence Time(24-hr Format)(HH)</h1>
              <form className={styles.form} onSubmit={(e) => submitHandler(e, "update")}>
                <select
                  className={styles.select}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                  required
                >
                  <option value="" hidden className={styles.disabledOption}>
                    Select
                  </option>
                  {timeArr.map((e, i) => {
                    return (
                      <option key={e} value={i}>
                        {e}
                      </option>
                    );
                  })}
                </select>

                <input type="submit" className={styles.submitTime} value="Update Time" />
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SetTime;
