import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import styles from "./Department.module.css";
import DeptCard from "./DeptCard";
import { AiOutlinePlusCircle } from "react-icons/ai";
import CreateDeptModal from "../createDept/CreateDept";
import MainSideNavbar from "../navbar/MainSideNavbar";
import Loader from "../Loader/Loader";

const ProfilePage = () => {
  // Declaring variables
  const [isOpen, setIsOpen] = useState(false);
  const [dept, setDept] = useState();
  const [loading, setLoading] = useState(false);
  const [newDeptCreated, setNewDeptCreated] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

          Promise.resolve(axios.get(process.env.REACT_APP_NODE_API_URL + "api/getallteams", config))
            .then((res) => {
              setDept(res.data.teams);
              setNewDeptCreated(false);
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
                // Handling erros except when access token is expired
                enqueueSnackbar("You are not an admin", {
                  variant: "error",
                });
                window.localStorage.clear();
                navigate("/");
                setLoading(false);
              } else {
                // Handling erros except when access token is expired
                enqueueSnackbar("Some error occurred. Please refresh the page", {
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
  }, [newDeptCreated]);

  return (
    <>
      {loading && <Loader />}
      <Navbar pageType="Admin" hasSidebar="true" />

      <MainSideNavbar currentPage="Department" />
      <div className={styles.mainContainer}>
        <div className={styles.createDept}>
          <h1 className={styles.create} onClick={() => setIsOpen(!isOpen)}>
            <AiOutlinePlusCircle /> &nbsp;&nbsp;Create Dept.
          </h1>
        </div>
        <div className={styles.container}>
          {dept !== undefined &&
            dept.map((e, i) => {
              return <DeptCard key={e._id} name={e.teamName} abv={e.abreviation} color={e.teamBg} />;
            })}
        </div>
        {isOpen && <CreateDeptModal setIsOpen={setIsOpen} setNewDeptCreated={setNewDeptCreated} />}
      </div>
    </>
  );
};

export default ProfilePage;
