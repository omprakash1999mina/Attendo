import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Card from "../userCard/Card";
import Navbar from "../navbar/Navbar";
import styles from "./Employees.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import DepartmentSidenavBar from "../navbar/DepartmentSidenavBar";
import Loader from "../Loader/Loader";

const EmployeesPage = () => {
  // Declaring variables
  const [employeeList, setEmployeeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

          Promise.resolve(axios.get(process.env.REACT_APP_NODE_API_URL + "api/users/team/" + params.className, config))
            .then((res) => {
              setEmployeeList(res.data.users);
              setLoading(false);
              return;
            })
            .catch((error) => {
              if (error.response && error.response.status === 401 && requestCount == 0) {
                // In case if access token has expired
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
                    window.localStorage.clear();
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
                enqueueSnackbar("Some error occurred. Please refresh the page again", {
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

      getdata(0);
      return;
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      setLoading(false);
      return;
    }
  }, []);
  return (
    <>
      <Navbar pageType="Admin" hasSidebar="true" />
      {loading && <Loader />}
      <DepartmentSidenavBar />

      {employeeList != null && employeeList.length > 0 ? (
        <div className={styles.mainContainer}>
          {employeeList.map((e, i) => {
            return (
              <Card
                key={e._id}
                name={e.userName}
                rank={e.teamName}
                image={e.profileImgLink}
                presentDays={e.attendance.previousMonth.P}
                absentDays={e.attendance.previousMonth.A}
                userId={e._id}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.noEmployeeDiv}>
          <h1 className={styles.noEmployeeText}>
            Currently, No Member in this Department. Click on the <AiOutlinePlusCircle /> icon to add new members
          </h1>
        </div>
      )}
    </>
  );
};

export default EmployeesPage;
