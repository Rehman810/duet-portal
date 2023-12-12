import React, { useState } from "react";
import { Input } from "antd";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
import Logo from "../assets/duet.png";
import "./Login.css";
import { Button } from "antd";
import { doc, onSnapshot } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [selectedOption, setSelectedOption] = useState("student");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Handle the login process with authentication
  const handleLogin = async () => {
    setProgress(30);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          if (selectedOption == "cr") {
            const userDocRef = doc(db, "CR-info", uid);
            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                localStorage.setItem("role", data.role);
                localStorage.setItem("name", data.UserName);
                if (data.role === "cr") {
                  console.log("User found:", data);
                  localStorage.setItem("uid", user.uid);
                  setProgress(100);
                  setTimeout(() => {
                    navigate("/");
                  }, 200);
                } else {
                  setProgress(100);
                  Swal.fire({
                    icon: "error",
                    title: "Try Again",
                    text: "Something went wrong!",
                  });
                }
              } else {
                setProgress(100);
                Swal.fire({
                  icon: "error",
                  title: "Access Denied",
                  text: "You are not a Class Representative!",
                });
              }
            });
          } else if (selectedOption == "student") {
            const userDocRef = doc(db, "student-info", uid);
            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.role === "student") {
                  console.log("User found:", user.uid);
                  localStorage.setItem("uid", user.uid);
                  localStorage.setItem("role", user.role);
                  localStorage.setItem("name", user.UserName);
                  setProgress(100);
                  setTimeout(() => {
                    navigate("/student");
                  }, 500);
                } else {
                  setProgress(100);
                  Swal.fire({
                    icon: "error",
                    title: "Try Again",
                    text: "Something went wrong!",
                  });
                }
              } else {
                setProgress(100);
                Swal.fire({
                  icon: "error",
                  title: "Access Denied",
                  text: "You are not a Student!",
                });
              }
            });
          }
        } else {
          console.log("User not found");
          setProgress(100);
        }
      });
    } catch (error) {
      setProgress(100);
      Swal.fire({
        icon: "error",
        title: "Try Again",
        text: "Wrong email or password!",
      });
      console.error(error);
    }
  };

  return (
    <div className="login">
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="logo-con">
        <img src={Logo} alt="duet" className="logo" />
        <span className="logo-text">
          DAWOOD UNIVERSITY OF ENGINEERING AND TECHNOLOGY
        </span>
      </div>
      <div className="login-box">
        <span className="head">Log in</span>
        <div style={{ marginTop: 20 }}>
          <Input
            placeholder="Enetr email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder="Enter password"
            style={{ marginTop: 10 }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="div-opt">
          <div className="option">
            <label className="label">Are you a? &nbsp;</label>
            <select
              className="select"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="student">Student</option>
              <option value="cr">Class Representative</option>
            </select>
          </div>
        </div>
        <div className="div-reg">
          <Button type="primary" className="register" onClick={handleLogin}>
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
