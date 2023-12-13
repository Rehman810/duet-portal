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
import { MdOutlineDelete } from "react-icons/md";

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
      setProgress(100); // Show loading bar with 100% progress
      setTimeout(() => {}, 200);
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
    } else {
      Swal.fire({
        icon: "error",
        title: "Try Again",
        text: "Fields are empty!",
      });
    }

    setProgress(100); // Show loading bar with 100% progress
    setTimeout(() => {
      setLink("");
      setSem("");
    }, 200);
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
  const handleDeleteField = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This material will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userPostsCollectionRef = collection(db, "study-material");
          const docRef = doc(userPostsCollectionRef, id); // Reference to the specific document
          await deleteDoc(docRef);
          Swal.fire("Deleted!", "This material has been deleted.", "success");
          setUserPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== id)
          );
        } catch (error) {
          console.error("Error deleting document:", error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the document.",
            "error"
          );
        }
      }
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
            <span className="header">Study Material</span>
          </div>
          <div className="input">
            <p style={{ fontSize: "14px" }}>
              <b>NOTE:</b> Save all your documents and study material in any
              drive i.e. Google or One Drive, and paste it's link here. Before
              giving a URL, first go to your drive, then your file, then give
              access to everyone.
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
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "30px",
            }}
          />
        ) : userPosts.length > 0 ? (
          userPosts.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "30px",
                flexDirection: "row",
              }}
            >
              <a href={`${a.link}`} target="_blank">
                <span>{a.sem}</span>
              </a>
              <div className="delete">
                <MdOutlineDelete
                  style={{ marginLeft: "20px" }}
                  size={20}
                  color="blue"
                  onClick={() => {
                    handleDeleteField(a.id);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>No study material available.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Materials;
