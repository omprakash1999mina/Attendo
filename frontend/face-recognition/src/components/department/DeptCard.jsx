import React from "react";
import styles from "./Department.module.css";
import { Link } from "react-router-dom";

const DeptCard = ({ name, color, abv }) => {
 
  const handleClick = () => {
    localStorage.setItem("deptName", name);
    localStorage.setItem("deptColor",color)
    localStorage.setItem("deptAbv",abv)
  };
  return (
    <Link to={`/department/${name}`} className={styles.link} onClick={() => handleClick()}>
      <div className={styles.cardContainer}>
        <div className={styles.imageContainer} style={{ background: color }}>
          <h1 className={styles.abv}>{abv}</h1>
        </div>
        <div className={styles.nameContainer} title={name}>
          <h1 className={styles.name}>{name}</h1>
        </div>
      </div>
    </Link>
  );
};

export default DeptCard;
