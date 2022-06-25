import React, { useState, useEffect } from "react";
import styles from "./SetHolidays.module.css";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Loader from "../Loader/Loader";

const SetHolidays = () => {
  // Declaring variables
  const [day, setDay] = useState([]);
  const [date, setDate] = useState([]);
  const [buttonType, setButtonType] = useState();
  const [modifiedDays, setModifiedDays] = useState([]);
  const [modifiedDate, setModifiedDate] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(moment());
  const { enqueueSnackbar } = useSnackbar();
  const [isCurrExist, setIsCurrExist] = useState(false); //State to check whether holidays are previous set
  const navigate = useNavigate();
  const [holidaysChanged, setHolidaysChanged] = useState(false);

  // Declaring weekdays
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];

  // Function to call the server to get holidays
  useEffect(() => {
    setLoading(true);
    setHolidaysChanged(false);
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

          Promise.resolve(axios.get(process.env.REACT_APP_NODE_API_URL + "api/get/holidays", config))
            .then((res) => {
              setDay(res.data.holidays.days);
              setDate(res.data.holidays.dates);

              // Handling the received data to show week days by name
              let daysData = [];
              for (let i = 0; i < res.data.holidays.days.length; i++) {
                i != res.data.holidays.days.length - 1
                  ? daysData.push(weekDays[res.data.holidays.days[i]] + ", ")
                  : daysData.push(weekDays[res.data.holidays.days[i]]);
              }
              setModifiedDays(daysData);

              // Handling the received data to show gotten dates in a DD-MMMM-YYYY format
              let dateData = [];
              for (let i = 0; i < res.data.holidays.dates.length; i++) {
                i != res.data.holidays.dates.length - 1
                  ? dateData.push(
                      res.data.holidays.dates[i] +
                        "-" +
                        value.clone().format("MMMM") +
                        "-" +
                        value.clone().format("YYYY") +
                        ", "
                    )
                  : dateData.push(
                      res.data.holidays.dates[i] +
                        "-" +
                        value.clone().format("MMMM") +
                        "-" +
                        value.clone().format("YYYY")
                    );
              }
              setModifiedDate(dateData);

              setIsCurrExist(true);
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
                    getdata();
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
              } else if (error.response && error.response.status === 400) {
                // No current holiday set
                setLoading(false);
              } else if (error.response && error.response.status === 401 && requestCount > 0) {
                // Handling erros when user is not admin
                enqueueSnackbar("You are not an admin", {
                  variant: "error",
                });
                window.localStorage.clear();
                navigate("/");
                setLoading(false);
              }else {
                enqueueSnackbar("Some error occured, please try again later", {
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
      getdata();
      return;
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      navigate("/");
      return;
    }
  }, [holidaysChanged]);

  return (
    <>
      {loading && <Loader />}
      <div className={styles.mainHolidayContainer}>
        <div className={styles.headingHoliday}>Set Holidays</div>
        <div className={styles.container}>
          {isCurrExist && (
            <>
              <div className={styles.getHolidays}>
                <div className={styles.setHolidaysLabel}>
                  <h1 className={styles.labelHolidayTitle}>Current Holidays{`(Day-wise)`}</h1>
                  <div className={styles.holidaysContainer}>
                    <h1 className={styles.holidaysText}>{modifiedDays}</h1>
                  </div>
                </div>
                <hr className={styles.separator} />
                <div className={styles.setHolidaysLabel}>
                  <h1 className={styles.labelHolidayTitle}>Current Month Holidays{`(Date-wise)`}</h1>
                  <div className={styles.holidaysContainer}>
                    <h1 className={styles.holidaysText}>{modifiedDate}</h1>
                  </div>
                </div>
                <hr className={styles.separator} />
              </div>
              <div className={styles.setUpdateContainer}>
                <h1 className={styles.setUpdateText}>Update Holidays </h1>
                <button
                  className={styles.modalOpenBtn}
                  onClick={() => {
                    setButtonType("Update");
                    setModelOpen(true);
                  }}
                >
                  Update Holidays
                </button>
                <button
                  className={styles.modalOpenBtnSmallScreen}
                  onClick={() => {
                    setButtonType("Update");
                    setModelOpen(true);
                  }}
                >
                  Update
                </button>
              </div>
            </>
          )}
          {!isCurrExist && (
            <div className={styles.setUpdateContainer}>
              <h1 className={styles.setUpdateText}>Set Holidays</h1>
              <button
                className={styles.modalOpenBtn}
                onClick={() => {
                  setButtonType("Set");
                  setModelOpen(true);
                }}
              >
                Set Holidays
              </button>
              <button
                className={styles.modalOpenBtnSmallScreen}
                onClick={() => {
                  setButtonType("Set");
                  setModelOpen(true);
                }}
              >
                Set
              </button>
            </div>
          )}
        </div>
      </div>
      {modelOpen && buttonType == "Set" && (
        <Modal type="set" setIsOpen={setModelOpen} setHolidaysChanged={setHolidaysChanged} />
      )}
      {modelOpen && buttonType == "Update" && (
        <Modal
          type="update"
          setIsOpen={setModelOpen}
          currDays={day}
          currDates={date}
          setHolidaysChanged={setHolidaysChanged}
        />
      )}
    </>
  );
};

export default SetHolidays;
