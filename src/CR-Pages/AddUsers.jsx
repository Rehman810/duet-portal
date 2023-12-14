import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import Swal from "sweetalert2";
import { Input, Button } from "antd";
import LoadingBar from "react-top-loading-bar";
import "./AddUser.css";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../Firebase";
import {
  serverTimestamp,
  collection,
  setDoc,
  query,
  onSnapshot,
  doc,
} from "firebase/firestore";

const AddUsers = () => {
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("student");
  const [crcheck, setCrCheck] = useState("");
  const [stdcheck, setstdCheck] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    const check = async () => {
      try {
        const userPostsCollectionRef = collection(db, "Cr-info");
        const queryForPosts = query(userPostsCollectionRef);

        const unsubscribe = onSnapshot(queryForPosts, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            posts.push(doc.data().RollNo);
          });
          setCrCheck(posts.flat());
        });

        const userPostsCollectionRefstd = collection(db, "student-info");
        const queryForPostsstd = query(userPostsCollectionRefstd);

        const unsubscribestd = onSnapshot(queryForPostsstd, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            posts.push(doc.data().RollNo);
          });
          setstdCheck(posts.flat());
        });

        return () => {
          unsubscribe();
          unsubscribestd();
        };
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    check();
  }, []);

  const handleSave = async () => {
    if (!crcheck.includes(rollNum) && !stdcheck.includes(rollNum)) {
      setProgress(30); // Show loading bar with 30% progress
      return await createUserWithEmailAndPassword(auth, email, password)
        .then((e) => {
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              try {
                if (selectedOption === "student") {
                  const userDocRef = doc(db, "student-info", e.user.uid);
                  await setDoc(userDocRef, {
                    UserName: name,
                    RollNo: rollNum,
                    email: email,
                    role: "student",
                    DateofRegister: serverTimestamp(),
                  });
                } else if (selectedOption === "cr") {
                  const userDocRef = doc(db, "CR-info", e.user.uid);
                  await setDoc(userDocRef, {
                    UserName: name,
                    RollNo: rollNum,
                    email: email,
                    role: "cr",
                    DateofRegister: serverTimestamp(),
                  });
                }

                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "User created successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
              setProgress(100); // Show loading bar with 100% progress
              setTimeout(() => {}, 200);
              setEmail("");
              setPassword("");
              setName("");
              setRollNum("");
            } else {
              console.log("user not found");
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Try Again",
            text: "Something went wrong!",
          });
          console.log(error);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Try Again",
        text: "Identical Roll Number",
      });
    }
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
        users={"user"}
        material={"material"}
        home={"/"} userRole={"cr"}
      />
      <div className="createBox">
        <div className="container">
          <div className="top-header">
            <span className="header">Create User</span>
          </div>
          <div className="input">
            <Input
              className="inp"
              placeholder="Enter UserName"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="inp"
              placeholder="Enter Roll Number"
              onChange={(e) => setRollNum(e.target.value)}
            />
            <Input
              className="inp"
              placeholder="Enter Email address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
              className="inp"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="div-opt">
            <div className="option">
              <label className="label">Want to add? &nbsp;</label>
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
