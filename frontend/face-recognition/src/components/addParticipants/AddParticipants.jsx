import React, { useState, useEffect } from "react";
import styles from "./AddParticipants.module.css";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import Loader from "../Loader/Loader";
import PasswordModal from "./PasswordModal";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { handleFileInputChange, getBase64 } from "./helper";
import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setDefaultPassword } from "../../features/User/UserPasswordSlice";

const AddParticipants = () => {
  // Declaring variables
  const params = useParams();
  const teamName = params.className;
  const [file, setFile] = useState(null);
  const [base64URL, setbase64URL] = useState("");
  const [loading, setLoading] = useState(false);
  const [encoding, setEncoding] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workProfile, setWorkProfile] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // Converting image to base64url and handling the errors
  useEffect(() => {
    setLoading(true);
    if (file != null && file != undefined) {
      getBase64(file)
        .then((result) => {
          setbase64URL(result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [file]);

  useEffect(() => {
    setLoading(false);
  }, [base64URL]);

  // Function to get the encoding of the image selected as input
  const getEncoding = () => {
    setLoading(true);
    if (base64URL != "") {
      Promise.resolve(axios.post(process.env.REACT_APP_FLASK_API_URL + "getEncodings", { data: base64URL }))
        .then((res) => {
          setEncoding(res.data.encodeList[0].toString());
          setLoading(false);
          enqueueSnackbar("Face identified accurately", {
            variant: "success",
          });
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar(error.response.data.error, {
            variant: "error",
          });
          setEncoding(null);
        });
    } else {
      enqueueSnackbar("Select an image first", {
        variant: "warning",
      });
      setLoading(false);
    }
  };

  // Handle case when image is not processed and trying to submit the form
  const notSubmit = (e) => {
    e.preventDefault();
    alert("Process image first");
  };

  // Function to check all good with form and start submission process
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    if (encoding == null) {
      enqueueSnackbar("Image not processed. Please try again", {
        variant: "error",
      });
      setLoading(false);
      return;
    }
    if (file != undefined && file !== null) {
      uploadFiles(file);
    } else {
      setLoading(false);
    }
  };

  // Upload the image on firebase storage
  const uploadFiles = (file) => {
    setLoading(true);
    if (!file) return;
    const storageRef = ref(storage, `images/employees/${new Date().getTime()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        enqueueSnackbar("Some error occurred while uploading image. Please try again", {
          variant: "error",
        });
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          submit(url);
        });
      }
    );
  };

  // Main function to submit the form and post the data to the server
  const submit = (firebaseURL) => {
    setLoading(true);
    try {
      const getdata = (requestCount) => {
        const atoken = window.localStorage.getItem("accessToken");
        const rtoken = window.localStorage.getItem("refreshToken");

        // Handling case whether access token is present or not
        if (atoken) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${atoken}`,
            },
          };

          Promise.resolve(
            axios.post(
              process.env.REACT_APP_NODE_API_URL + "api/user/register",
              {
                userName: name,
                email: email,
                workProfile: workProfile,
                teamName: teamName,
                profileImgLink: firebaseURL,
                encodings: encoding,
                contactNumber: mobileNumber,
              },
              config
            )
          )
            .then((res) => {
              dispatch(setDefaultPassword(res.data.default_password));
              enqueueSnackbar("User registered successfully", {
                variant: "success",
              });
              setIsOpen(true);
              setLoading(false);
              return;
            })
            .catch((error) => {
              // Handling case when access token is expired
              if (error.response && error.response.status === 401 && requestCount == 0) {
                axios
                  .post(process.env.REACT_APP_NODE_API_URL + "api/user/refresh", {
                    refresh_token: rtoken,
                  })
                  .then((res) => {
                    // Updating access and refresh token
                    localStorage.setItem("accessToken", res.data.access_token);
                    localStorage.setItem("refreshToken", res.data.refresh_token);
                    getdata(1);
                    return;
                  })
                  .catch((error) => {
                    enqueueSnackbar("You are not logged in", {
                      variant: "error",
                    });
                    setLoading(false);
                    window.localStorage.clear();
                    navigate("/");
                    return;
                  });
              } else if (error.response && error.response.status == 409) {
                enqueueSnackbar("This email is already been taken", {
                  variant: "error",
                });
                setLoading(false);
              } else if (error.response && error.response.status === 401 && requestCount > 0) {
                // Handling erros when user is not admin
                enqueueSnackbar("You are not an admin", {
                  variant: "error",
                });
                window.localStorage.clear();
                navigate("/");
                setLoading(false);
              } else {
                enqueueSnackbar("Some error occurred while submitting. Please try again", {
                  variant: "error",
                });
                setLoading(false);
              }
            });
        } else {
          enqueueSnackbar("You need to login first", {
            variant: "error",
          });
          window.localStorage.clear();
          setLoading(false);
          navigate("/");
          return;
        }
      };

      getdata(0);
      return;
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar pageType="Admin" />
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Add New Participant</h1>
          <form className={styles.form} onSubmit={(e) => (encoding != null ? submitHandler(e) : notSubmit(e))}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
              required
              minLength="4"
              maxLength="50"
            />
            <label className={styles.label}>Rank</label>
            <input type="text" className={styles.input} onChange={(e) => setWorkProfile(e.target.value)} required />
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} onChange={(e) => setEmail(e.target.value)} required />
            <label className={styles.label}>Mobile Number</label>
            <input type="number" className={styles.input} required onChange={(e) => setMobileNumber(e.target.value)} />
            <label className={styles.label}>Image</label>
            <div className={styles.inputGroup}>
              <input
                type="file"
                name="myImage"
                accept="image/*"
                className={styles.inputImage}
                onChange={(e) => {
                  handleFileInputChange(e, setLoading, setFile, setbase64URL, setEncoding);
                }}
              />
              <input type="button" className={styles.btnGetEncodings} value="Process Image" onClick={getEncoding} />
            </div>
            <input type="submit" className={styles.btnSubmit} value="Submit" />
          </form>
        </div>
      </div>
      {isOpen && <PasswordModal setIsOpen={setIsOpen} email={email} />}
    </>
  );
};

export default AddParticipants;
