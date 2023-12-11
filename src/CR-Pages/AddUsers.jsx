import React from "react";
import Navbar from "../CommonComp/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { serverTimestamp } from "firebase/firestore";
import { Input } from "antd";
import LoadingBar from "react-top-loading-bar";
import "./AddUser.css";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../Firebase";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "antd";

const AddUsers = () => {
  let navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState();
  const [rollNum, setRollNum] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSave = async () => {
    setProgress(30); // Show loading bar with 30% progress
    return await createUserWithEmailAndPassword(auth, email, password)
      .then((e) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("user found", e.user.uid);
            try {
              const userDocRef = doc(db, "student-info", e.user.uid);
              await setDoc(userDocRef, {
                UserName: name,
                RollNo: rollNum,
                email: email,
                DateofRegister: serverTimestamp(),
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            setProgress(100); // Show loading bar with 100% progress
            setTimeout(() => {
              navigate("/user");
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

  return (
    <>
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        classes={"classes"}
        users={"user"}
        material={"material"}
        home={"/"}
      />
      <div className="createBox">
        <div className="container">
          <div className="top-header">
            <span className="header">Create User</span>
          </div>
          <div className="input">
            <Input
              type="text"
              placeholder="Enter UserName"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Roll Number"
              onChange={(e) => setRollNum(e.target.value)}
            />
            <Input
              placeholder="Enter Email address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Enter Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button type="primary" className="register" onClick={handleSave}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUsers;
