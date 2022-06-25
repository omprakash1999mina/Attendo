import React, { useState } from "react";
import styles from "./CreateDept.module.css";
import axios from "axios";
import RandomColor from "./randomColor";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import Loader from "../Loader/Loader";

const CreateDeptModal = ({ setIsOpen, setNewDeptCreated }) => {
  // Declaring variables
  const [deptName, setDeptName] = useState("");
  const [abv, setAbv] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Function to get abreviation of a dept/class name
  const getAbrevation = () => {
    const allWords = deptName.split(" ");
    if (allWords.length < 2) {
      return deptName.slice(0, 2).toUpperCase();
    } else {
      return allWords[0][0].toUpperCase() + allWords[1][0].toUpperCase();
    }
  };

  // Function to submit the request to create class
  const submitHandler = (e) => {
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
              process.env.REACT_APP_NODE_API_URL + "api/create/team",
              {
                adminId: localStorage.getItem("userId"),
                teamName: deptName,
                teamBg: RandomColor(),
                abreviation: abv.trim() != "" && abv.trim().length == 2 ? abv : getAbrevation(),
              },
              config
            )
          )
            .then((res) => {
              enqueueSnackbar(res.data.msg, {
                variant: "Success",
              });
              setNewDeptCreated(true);
              setIsOpen(false);
              setLoading(false);
              return;
            })
            .catch((error) => {
              // In case if access token has expired
              if (error.response && error.response.status === 401 && requestCount ==0) {
                axios
                  .post(process.env.REACT_APP_NODE_API_URL + "api/user/refresh", {
                    refresh_token: rtoken,
                  })
                  .then((res) => {
                    localStorage.setItem("accessToken", res.data.access_token);
                    localStorage.setItem("refreshToken", res.data.refresh_token);
                    getdata(1);
                    setIsOpen(false);
                    return;
                  })
                  .catch((error) => {
                    enqueueSnackbar("You are not logged in", {
                      variant: "error",
                    });
                    window.localStorage.clear();
                    setIsOpen(false);
                    setLoading(false);
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
              } else {
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
          setIsOpen(false);
          setLoading(false);
          navigate("/");
          return;
        }
      };

      // Calling the above function
      getdata(0);

      setIsOpen(false);
      return;
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      setIsOpen(false);
      setLoading(false);
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
            <h5 className={styles.heading}>Create New Department</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.modalContent}>
              <label className={styles.label}>Department Name</label>
              <input type="text" className={styles.input} required onChange={(e) => setDeptName(e.target.value)} />
              <label className={styles.label}>Abreviation {`(Optional)`}</label>
              <input
                className={styles.input}
                type="text"
                minLength="2"
                maxLength="2"
                onChange={(e) => setAbv(e.target.value)}
              />
            </div>
            <div className={styles.modalActions}>
              <input className={styles.submitBtn} type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDeptModal;
