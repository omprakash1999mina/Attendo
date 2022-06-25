import React from "react";
import styles from "../components/setTimeAndHoliday/SetTimeHolidayPage.module.css";
import SetTime from "../components/setTimeAndHoliday/SetTime";
import SetHolidays from "../components/setTimeAndHoliday/SetHolidays";
import Navbar from "../components/navbar/Navbar";
import MainSideNavbar from "../components/navbar/MainSideNavbar";

const SetTimeHolidayPage = () => {
  return (
    <>
      <Navbar pageType="Admin" hasSidebar="true" />
      <MainSideNavbar currentPage="SetTimeHoliday" />
      <div className={styles.mainContainer}>
        <div className={styles.innerTimeContainer}>
          <SetTime />
          <SetHolidays />
        </div>
      </div>
    </>
  );
};

export default SetTimeHolidayPage;
