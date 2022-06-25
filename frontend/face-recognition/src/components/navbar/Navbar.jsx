import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

import { useDispatch, useSelector } from "react-redux";
import { getSidebar, smallSidebarOpen } from "../../features/Sidebar/SidebarSlice";
import { FaUsers } from "react-icons/fa";

const Navbar = ({ pageType, hasSidebar }) => {
  // Declaring variables
  const dispatch = useDispatch();
  const sidebar = useSelector(getSidebar);
  const navigate = useNavigate();

  // Handling burger clicks

  return (
    <>
      <nav className={`${styles.navbar}`}>
        <div className={styles.iconContainer} onClick={() => navigate("/")}>
          <FaUsers className={styles.icon} />
          <p className={styles.iconName}>Attendo</p>
        </div>

        {pageType == "Admin" && (
          <>
            <h2 className={styles.adminHeading}>
              Hi<span className={styles.hand}>👋</span>, Welcome to the Admin Panel
            </h2>
            {hasSidebar && (
              <div className={styles.burgerAdmin} onClick={() => dispatch(smallSidebarOpen())}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            )}
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
