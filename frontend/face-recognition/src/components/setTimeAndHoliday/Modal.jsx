import React, { useState } from "react";
import styles from "./Modal.module.css";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { RiCloseLine } from "react-icons/ri";
import { handleChangeDay, handleChangeDate, inputChecker } from "./helper";
import Loader from "../Loader/Loader";

const Modal = ({ type, setIsOpen, currDays, currDates, setHolidaysChanged }) => {
  const [value, setValue] = useState(moment());
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [newDays, setNewDays] = useState("");
  const [newDates, setNewDates] = useState("");
  const endDayMonth = parseInt(value.clone().endOf("month").format("DD"));

  const submitHandler = (e, type) => {
    e.preventDefault();
    setLoading(true);

    // Checking the input and getting result in array format
    let daysData = inputChecker(newDays, 6);
    let datesData = inputChecker(newDates, endDayMonth);

    // Asking user to edit input fields if invalid
    if (!daysData || !datesData) {
      enqueueSnackbar("Some error in the input.Please check and try again !!", {
        variant: "error",
      });
      setLoading(false);
      return;
    }

    // If type is update and some field is empty, then set that feild value to previous values
    if (type != "set") {
      if (daysData.length == 0) {
        daysData = currDays;
      }
      if (datesData.length == 0) {
        datesData = currDates;
      }
    }

    try {
      // Function which handle the request and handle the request in case access token is expired
      const getdata = () => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");
        const id = window.localStorage.getItem("userId");
        if (atoken && id) {
          const config = {
            headers: {
              Authorization: `Bearer ${atoken}`,
            },
          };

          const data = {
            adminId: id,
            days: daysData,
            dates: datesData,
          };

          Promise.resolve(axios.post(process.env.REACT_APP_NODE_API_URL + "api/" + type + "/holidays", data, config))
            .then((res) => {
              setLoading(false);
              enqueueSnackbar("Holidays updated successfully", {
                variant: "success",
              });
              setHolidaysChanged(true);
              setIsOpen(false);
              return;
            })
            .catch((error) => {
              // In case if access token has expired
              if (error.response && error.response.status === 401) {
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
              } else {
                // No holiday set yet
                enqueueSnackbar("Some error occured, please try again later", {
                  variant: "error",
                });
                setLoading(false);
              }
            });
        } else {
          enqueueSnackbar("You need to login first", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          navigate("/");
          return;
        }
      };

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
  };
  return (
    <>
      {loading && <Loader />}
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>{`${type} Holidays`}</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <form className={styles.form} onSubmit={(e) => submitHandler(e, type)}>
            <div className={styles.modalContent}>
              <label className={styles.label}>
                {type} Holidays{`(Day-wise)`}
              </label>
              <label className={styles.subLabel}>{`(Starting from Sunday = 0, Monday = 1 .....)`}</label>
              <input
                type="text"
                className={styles.input}
                placeholder=" eg : 0,3"
                value={newDays}
                onChange={(e) => handleChangeDay(e, setNewDays)}
              />
              <label className={styles.label}>
                {type} Holidays{`(Date-wise)`}
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder=" eg : 22,26"
                value={newDates}
                onChange={(e) => handleChangeDate(e, setNewDates)}
              />
            </div>
            <div className={styles.modalActions}>
              <input className={styles.submitBtn} type="submit" value={`${type} Holidays`} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
