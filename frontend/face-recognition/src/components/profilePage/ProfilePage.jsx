import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useParams, useNavigate } from "react-router-dom";
import Calender from "../calender/Calender";
import Navbar from "../navbar/Navbar";
import Profile from "../userProfile/Profile";
import styles from "./ProfilePage.module.css";
import Loader from "../Loader/Loader";
import { FaUsers } from "react-icons/fa";

const ProfilePage = ({ pageType }) => {
  // Declaring variables
  const params = useParams();
  const [name, setName] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [workProfile, setWorkProfile] = useState("");
  const [teamName, setTeamName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currentMonthAttendence, setCurrentMonthAttendence] = useState([]);
  const [joiningDate, setJoiningDate] = useState();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Calling the backend server to get the user data
  useEffect(() => {
    setLoading(true);
    try {
      // Function which handle the request and handle the request in case access token is expired
      const getdata = () => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");
        if (atoken) {
          const config = {
            headers: {
              Authorization: `Bearer ${atoken}`,
            },
          };

          axios
            .get(process.env.REACT_APP_NODE_API_URL + "api/users/" + params.userId, config)
            .then((res) => {
              setName(res.data.users.userName);
              setTeamName(res.data.users.teamName);
              setEmail(res.data.users.email);
              setImgURL(res.data.users.profileImgLink);
              setMobileNumber(res.data.users.contactNumber);
              setWorkProfile(res.data.users.workProfile);
              setJoiningDate(res.data.users.joiningDate);
              setCurrentMonthAttendence(res.data.users.attendance.currentMonth);
              setLoading(false);
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
                    window.localStorage.clear();
                    setLoading(false);
                    navigate("/");
                    return;
                  });
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
  }, []);

  // Handling the logout functionality
  const logoutHandler = () => {
    setLoading(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const rtoken = localStorage.getItem("refreshToken");
    if (rtoken) {
      Promise.resolve(
        axios.post(
          process.env.REACT_APP_NODE_API_URL + "api/user/logout",
          {
            refresh_token: rtoken,
          },
          config
        )
      )
        .then((res) => {
          enqueueSnackbar("Logged out successfully", {
            variant: "success",
          });
          localStorage.clear();
          setLoading(false);
          navigate("/");
        })
        .catch((err) => {
          enqueueSnackbar("Some error occurred while logout", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          navigate("/");
        });
    } else {
      enqueueSnackbar("Some error occurred while logout", {
        variant: "error",
      });
      window.localStorage.clear();
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <>
      {loading && <Loader />}
      {pageType == "Admin" && (
        <>
          <Navbar pageType={pageType} />
          <div className={styles.mainContainer}>
            <div className={styles.subContainer}>
              <Profile
                name={name}
                imgURL={imgURL}
                workProfile={workProfile}
                teamName={teamName}
                mobileNumber={mobileNumber}
                email={email}
              />
              <Calender currentMonthAttendence={currentMonthAttendence} joiningDate={joiningDate} />
            </div>
          </div>
        </>
      )}
      {pageType == "Normal" && (
        <>
          <div className={styles.mainContainerNormal}>
            <div className={styles.topContainer}>
              <div className={styles.iconContainer} onClick={() => navigate("/")}>
                <FaUsers className={styles.icon} />
                <p className={styles.iconName}>Attendo</p>
              </div>
              <div className={styles.btnAdminContainer}>
                <button
                  className={styles.btnAdmin}
                  onClick={() => {
                    logoutHandler();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
            <div className={styles.subContainerNormal}>
              <div className={styles.profileComponent}>
                <Profile
                  name={name}
                  imgURL={imgURL}
                  workProfile={workProfile}
                  teamName={teamName}
                  mobileNumber={mobileNumber}
                  email={email}
                />
              </div>
              <div className={styles.calendarComponent}>
                <Calender currentMonthAttendence={currentMonthAttendence} joiningDate={joiningDate} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfilePage;
