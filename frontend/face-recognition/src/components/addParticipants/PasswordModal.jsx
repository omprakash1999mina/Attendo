import React from "react";
import styles from "./PasswordModal.module.css";
import { RiCloseLine } from "react-icons/ri";
import {useSelector} from "react-redux"
import {getPassword } from "../../features/User/UserPasswordSlice"
const PasswordModal = ({ setIsOpen, email }) => {
    const password = useSelector(getPassword)
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>User Details</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>

          <div className={styles.modalContent}>
            <label className={styles.label}>Email</label>
            <div className={styles.input}>{email}</div>
            <label className={styles.label}>Default Password</label>
            <div className={styles.input}>{password.defaultPassword}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordModal;
