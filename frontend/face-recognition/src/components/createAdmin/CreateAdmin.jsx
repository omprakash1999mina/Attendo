import React, { useState } from "react";
import styles from "./CreateAdmin.module.css";
import Navbar from "../navbar/Navbar";
import MainSideNavbar from "../navbar/MainSideNavbar";
import Loader from "../Loader/Loader";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const getdata = (requestCount) => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");

        // Handling case whether access token is present or not
        if (atoken) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${atoken}`,
            },
          };

          Promise.resolve(
            axios.post(
              process.env.REACT_APP_NODE_API_URL + "api/admin/register",
              {
                email: email,
              },
              config
            )
          )
            .then((res) => {
              enqueueSnackbar("Admin registered successfully", {
                variant: "success",
              });
              setLoading(false);
              return;
            })
            .catch((error) => {
              // Handling case when access token is expired
              if (error.response && error.response.status === 401 && requestCount == 0) {
                axios
                  .post(process.env.REACT_APP_NODE_API_URL + "api/user/refresh", {
                    refresh_token: rtoken,
                  })
                  .then((res) => {
                    // Updating access and refresh token
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
              } else if (error.response && error.response.status === 400) {
                // Handling erros when user is not admin
                enqueueSnackbar("This email is not registered.", {
                  variant: "error",
                });
                setLoading(false);
              } else {
                enqueueSnackbar("Some error occurred while registering. Please try again", {
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

      getdata(0);
      return;
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar pageType="Admin" hasSidebar="true" />
      <MainSideNavbar currentPage="Create Admin" />
      <div className={styles.mainContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.mainInnerContainer}>
            <div className={styles.headingTime}>Create Admin</div>
            <div className={styles.container}>
              <form className={styles.form}>
                <h1 className={styles.currTimeText}>Email</h1>
                <input
                  className={styles.currentTime}
                  placeholder="abc@gmail.com"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <input type="submit" value="Create Admin" className={styles.submit} onClick={submitHandler} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdmin;
