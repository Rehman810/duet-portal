import React, { useState } from "react";
import Logo from "../assets/duet.png";
import { Input } from "antd";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../Firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";

const SignUp = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [rollNo, setRollNo] = useState();

  const Signup = async () => {
    setProgress(30); // Show loading bar with 30% progress
    return await createUserWithEmailAndPassword(auth, email, password)
      .then((e) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("user found", e.user.uid);
            localStorage.setItem("uid", e.user.uid);
            try {
              const userDocRef = doc(db, "student-info", e.user.uid);
              await setDoc(userDocRef, {
                FullName: firstName,
                RollNo: rollNo,
                DateofRegister: serverTimestamp(),
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            setProgress(100); // Show loading bar with 100% progress
            setTimeout(() => {
              navigate("/student");
            }, 500);
          } else {
            console.log("user not found", user.uid);
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Try Again",
          text: "Wrong email or password!",
        });
        console.log(error);
      });
  };

  const Login = () => {
    setProgress(100); // Show loading bar with 100% progress
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="login signup">
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <img src={Logo} alt="duet" className="facebook" />
      <div className="login-box">
        <span style={{ fontSize: 30, fontWeight: "bold" }}>
          SignUp to DUET portal
        </span>
        <div
          style={{
            marginTop: 20,
            borderTop: "1px solid #F1F2F4",
            paddingTop: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Input
              style={{ marginRight: 10 }}
              placeholder="Full Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              style={{ marginLeft: 10 }}
              placeholder="Roll No."
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>
          <Input
            style={{ marginTop: 10 }}
            placeholder="Mobile number or email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder="New password"
            style={{ marginTop: 10 }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p style={{ fontSize: 12 }}>
          By clicking Sign Up, you agree to our Terms, Privacy Policy and
          Cookies Policy. You may receive SMS notifications from us and can opt
          out at any time.
        </p>
        <span className="login-btn signupbtn" onClick={() => Signup()}>
          Sign Up
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <span className="login-bottom-btn" onClick={() => Login()}>
            Already have an account?
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
