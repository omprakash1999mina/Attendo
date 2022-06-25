import React, { useState } from "react";
import SideNavBar from "./SideNavBar";
import styles from "./SideNavBar.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../Loader/Loader";
import { AiOutlineFieldTime } from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import department from "../../assets/department.svg";
import criminal from "../../assets/criminal.svg";
import missing from "../../assets/missing.svg";
import logout from "../../assets/logout.svg";
import { useDispatch } from "react-redux";
import { smallSidebarClose } from "../../features/Sidebar/SidebarSlice";

const MainSideNavbar = ({ currentPage }) => {
  // Declaring variables
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handling the logout function
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
          dispatch(smallSidebarClose());
          navigate("/");
        })
        .catch((err) => {
          enqueueSnackbar("Some error occurred while logout", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          dispatch(smallSidebarClose());
          navigate("/");
        });
    } else {
      enqueueSnackbar("Some error occurred while logout", {
        variant: "error",
      });
      window.localStorage.clear();
      setLoading(false);
      dispatch(smallSidebarClose());
      navigate("/");
    }
  };
  return (
    <SideNavBar>
      {loading && <Loader />}
      <div className={styles.mainSideNavbar}>
        <Link
          to="/department"
          className={`${styles.item} ${currentPage == "Department" && styles.selected}`}
          onClick={() => {
            dispatch(smallSidebarClose());
          }}
        >
          <p className={styles.optionName}>Department</p>
          <img className={styles.svg} src={department} />
        </Link>
        <Link
          to="/settimeholidays"
          className={`${styles.item} ${currentPage == "SetTimeHoliday" && styles.selected}`}
          onClick={() => {
            dispatch(smallSidebarClose());
          }}
        >
          <p className={styles.optionName}>Set Attendence Time/Holidays</p>
          <div className={styles.svg}>
            <AiOutlineFieldTime fontSize="35px" />
          </div>
        </Link>
        <Link
          to="/createAdmin"
          className={`${styles.item} ${currentPage == "Create Admin" && styles.selected}`}
          onClick={() => {
            dispatch(smallSidebarClose());
          }}
        >
          <p className={styles.optionName}>Create Admin</p>
          <div className={styles.svg}>
            <RiAdminFill fontSize="35px" color="white"/>
          </div>
        </Link>
        <div className={`${styles.item} ${currentPage == "Logout" && styles.selected}`} onClick={logoutHandler}>
          <p className={styles.optionName}>Logout</p>
          <img className={styles.svg} src={logout} />
        </div>
      </div>
    </SideNavBar>
  );
};

export default MainSideNavbar;
