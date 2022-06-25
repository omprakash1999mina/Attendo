import React from "react";
import styles from "./SideNavBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSidebar, smallSidebarClose } from "../../features/Sidebar/SidebarSlice";
import { IoClose } from "react-icons/io5";

const SideNavBar = ({ children }) => {
  // Calling redux state
  const sidebar = useSelector(getSidebar);
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.sideBar}>{children}</div>
      {sidebar.open && (
        <>
          <div className={styles.sideBarSmallScreen}>{children}</div>
          <div
            className={styles.close}
            onClick={() => {
              dispatch(smallSidebarClose());
            }}
          >
            <IoClose />
          </div>
        </>
      )}
    </>
  );
};

export default SideNavBar;
