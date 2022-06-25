import React, { useState } from "react";
import styles from "./AttendanceModal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { useSnackbar } from "notistack";
import axios from "axios";
import Loader from "../Loader/Loader";

const AttendanceModal = ({ setTeamModalOpen, imageSrc }) => {
  // Declaring variables
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Handling the request for marking attandance
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (teamName == "") {
      enqueueSnackbar("Enter your team name", {
        variant: "warning",
      });
      setLoading(false);
      return;
    }

    // Call for backend API
    Promise.resolve(
      axios.post(process.env.REACT_APP_FLASK_API_URL + "markAttendence", {
        imageSrc: imageSrc,
        teamName: teamName,
      })
    )
      .then((res) => {
        enqueueSnackbar("Congratulations!!, Your attendence is marked", {
          variant: "success",
        });
        setLoading(false);
        setTeamModalOpen(false);
      })
      .catch((error) => {
        if (error.response && error.response.status !== 500) {
          enqueueSnackbar(error.response.data.error, {
            variant: "error",
          });
        }else{
          enqueueSnackbar("Your attendence can't be marked now", {
            variant: "error",
          });
        }
        setLoading(false);
        setTeamModalOpen(false);
      });
  };
  return (
    <>
      {loading && <Loader />}
      <div className={styles.darkBG} onClick={() => setTeamModalOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Enter your Team Name</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setTeamModalOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.modalContent}>
              <label className={styles.label}>Team/Department Name</label>
              <input type="text" className={styles.input} required onChange={(e) => setTeamName(e.target.value)} />
            </div>
            <div className={styles.modalActions}>
              <input className={styles.submitBtn} type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AttendanceModal;
