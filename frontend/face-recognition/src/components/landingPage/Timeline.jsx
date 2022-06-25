import React from "react";
import styles from "./Timeline.module.css";

const Timeline = () => {
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>Attendance Marking Schema</h1>
      <div className={styles.container}>
        <div className={styles.timeline}>
          <ul>
            <li>
              <div className={styles.timelineContent}>
                <h1>Turn ON your Camera</h1>
              </div>
            </li>
            <li>
              <div className={styles.timelineContent}>
                <h1>Click on Mark Attendance Button</h1>
              </div>
            </li>
            <li>
              <div className={styles.timelineContent}>
                <h1>Enter your Team/Dept. name</h1>
              </div>
            </li>
            <li>
              <div className={styles.timelineContent}>
                <h1>Click on Submit</h1>
              </div>
            </li>
            <li>
              <div className={styles.timelineContent}>
                <h1>Congratulations, your attendance is marked</h1>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
