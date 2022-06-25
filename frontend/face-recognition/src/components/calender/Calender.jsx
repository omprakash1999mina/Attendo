import React, { useState, useEffect } from "react";
import styles from "./Calender.module.css";
import moment from "moment";
import greenTick from "../../assets/greenTick.svg";

const Calender = ({ currentMonthAttendence, joiningDate }) => {
  // Declaring variables
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const todayDate = new Date().toDateString();
  const dayAttendence = currentMonthAttendence;
  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

  // Initialising calender array for current month
  useEffect(() => {
    const day = startDay.clone().subtract(1, "day");
    const a = [];
    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
    setCalendar(a);
  }, []);

  // Various check functions
  function beforeToday(day) {
    return day.isBefore(new Date(), "day");
  }
  function afterToday(day) {
    return day.isAfter(new Date(), "day");
  }
  function isToday(day) {
    return day.isSame(new Date(), "day");
  }
  function currentMonth(day) {
    return day.isSame(new Date(), "month");
  }
  function beforeJoining(day) {
    return day.isBefore(new Date(joiningDate), "day");
  }

  // Setting attendence
  function attendence(day) {
    const date = day.format("D");
    if (dayAttendence[date - 1] == "P") {
      return "Present";
    } else if (dayAttendence[date - 1] == "A") {
      return "Absent";
    } else if (dayAttendence[date - 1] == "H") {
      return "Holiday";
    } else {
      return "";
    }
  }

  return (
    <>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Attendence Calender</h1>
          <div className={styles.monthContainer}>
            <p className={styles.month}>{todayDate.split(" ")[1]}</p>
          </div>
        </div>
        <div>
          {weekdays.map((dayName) => (
            <div className={styles.day}>
              <div className={styles.dayBox}>{dayName}</div>
            </div>
          ))}
        </div>
        {calendar.map((week) => (
          <div className={styles.weekRow}>
            {week.map((day) => (
              <div className={styles.day}>
                <div className={`${styles.dayBox} ${currentMonth(day) ? "" : styles.blurDate}`}>
                  {/* Before joining Date */}
                  {beforeToday(day) && beforeJoining(day) ? (
                    <>
                      <div>{day.format("D").toString()}</div>
                      <span className={styles.notMarkedMark}></span>
                    </>
                  ) : (
                    ""
                  )}

                  {/* Before Today */}
                  {beforeToday(day) && !beforeJoining(day) && attendence(day) == "Present" ? (
                    <>
                      <div>{day.format("D").toString()}</div>
                      <span className={styles.presentMark}></span>
                    </>
                  ) : (
                    ""
                  )}
                  {beforeToday(day) && !beforeJoining(day) && attendence(day) == "Absent" ? (
                    <>
                      <div>{day.format("D").toString()}</div>
                      <span className={styles.absentMark}></span>
                    </>
                  ) : (
                    ""
                  )}
                  {beforeToday(day) && !beforeJoining(day) && attendence(day) == "Holiday" ? (
                    <>
                      <div className={styles.holiday}>{day.format("D").toString()}</div>
                      <span className={styles.holidayMark}></span>
                    </>
                  ) : (
                    ""
                  )}
                  {beforeToday(day) && !beforeJoining(day) && attendence(day) == "" ? (
                    <>
                      <div className={styles.notMarked}>{day.format("D").toString()}</div>
                      <span className={styles.notMarkedMark}></span>
                    </>
                  ) : (
                    ""
                  )}

                  {/* Today */}
                  {isToday(day) && attendence(day) == "Present" ? (
                    <>
                      <div className={styles.today}>{day.format("D").toString()}</div>
                      <span className={styles.presentMark}></span>
                    </>
                  ) : (
                    ""
                  )}
                  {isToday(day) && attendence(day) != "Present" ? (
                    <div className={styles.today}>{day.format("D").toString()}</div>
                  ) : (
                    ""
                  )}
                  {/* After Today */}
                  {afterToday(day) && day.format("D").toString()}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className={styles.bottomContainer}>
          <div className={styles.bottomLeftContainer}>
            <div className={styles.infoDiv}>
              <span className={styles.presentMark}></span>
              <span className={styles.info}>Present</span>
            </div>
            <div className={styles.infoDiv}>
              <span className={styles.absentMark}></span>
              <span className={styles.info}>Absent</span>
            </div>
          </div>
          <div className={styles.bottomRightContainer}>
            <div className={styles.infoDiv}>
              <span className={styles.holidayMark}></span>
              <span className={styles.info}>Holiday</span>
            </div>
            <div className={styles.infoDiv}>
              <span className={styles.notMarkedMark}></span>
              <span className={styles.info}>Not Marked</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;
