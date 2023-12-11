import React, { useState } from "react";
import { Input } from "antd";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
import Logo from "../assets/duet.png";

const Login = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // Navigate to the signup page with a loading bar animation
  const navigateToSignup = () => {
    setProgress(100);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
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
          if (email == "admin@gmail.com") {
            console.log("User found:", user.uid);
            localStorage.setItem("uid", user.uid);
            setProgress(100);
            setTimeout(() => {
              navigate("/");
            }, 500);
          } else {
            setProgress(100);
            setTimeout(() => {
              navigate("/student");
            }, 500);
          }
        } else {
          console.log("User not found");
        }
      });
    } catch (error) {
      // Display a SweetAlert for login failure
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
      <img src={Logo} alt="duet" className="facebook" />
      <div className="login-box">
        <span style={{ fontSize: 20 }}>Log in</span>
        <div style={{ marginTop: 20 }}>
          <Input
            placeholder="Email address or phone number"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder="Password"
            style={{ marginTop: 10 }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <span className="login-btn" onClick={handleLogin}>
          Log in
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <span className="login-bottom-btn">Forgotten account?</span>
          <span className="login-bottom-btn" onClick={navigateToSignup}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
