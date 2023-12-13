import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import { Input, Button } from "antd";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
import { db } from "../Firebase";
import {
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Spin } from "antd";

const Materials = () => {
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [sem, setSem] = useState("");
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);

  const CreateClass = async () => {
    setProgress(30);

    // Validate link starts with "https://"
    if (!link.startsWith("https://")) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "Please enter a valid url.",
      });
      setProgress(100);
      return;
    }

    if (link.trim() !== "" && sem.trim() !== "") {
      try {
        const userCollectionRef = collection(db, "study-material");
        await addDoc(userCollectionRef, {
          link: link,
          sem: sem,
          timestamp: serverTimestamp(),
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Materials has been saved.",
          showConfirmButton: false,
          timer: 1500,
        });
        setProgress(100);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Try Again",
          text: "Something went wrong!",
        });
        console.error(e);
      }
      setLink("");
      setSem("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Try Again",
        text: "Fields are empty!",
      });
    }

    setProgress(0);
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const userPostsCollectionRef = collection(db, "study-material");
        const queryForPosts = query(
          userPostsCollectionRef,
          orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(queryForPosts, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            posts.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setUserPosts(posts);
          setLoading(false);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };

    fetchMaterial();
  }, []);

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
            <span className="header">Study Material</span>
          </div>
          <div className="input">
            <p style={{ fontSize: "14px" }}>
              <b>NOTE:</b> Save all your documents and study material in any
              drive i.e. Google or One Drive, and paste it's link here.
            </p>
            <Input
              required
              className="inp"
              placeholder="Enter Semester"
              onChange={(e) => setSem(e.target.value)}
            />
            <Input
              required
              allowClear
              className="inp"
              placeholder="Enter the link of your Google drive or One Drive."
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="div-reg">
            <Button type="primary" className="register" onClick={CreateClass}>
              Create
            </Button>
          </div>
        </div>
        <div className="all-cl">
          <div></div>
        </div>
      </div>
      <div>
        {loading ? (
          <Spin className="spin" />
        ) : userPosts.length > 0 ? (
          userPosts.map((a) => (
            <div key={a.id}>
              <a href={`${a.link}`}>
                <span>{a.sem}</span>
              </a>
            </div>
          ))
        ) : (
          <div className="no-data-message">
            <p>No study material available.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Materials;
