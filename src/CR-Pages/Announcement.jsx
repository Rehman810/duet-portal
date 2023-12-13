import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import { Input } from "antd";
import "./Announcement.css";
import { Button } from "antd";
import { MdOutlineDelete } from "react-icons/md";
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
import Swal from "sweetalert2";
import Edit from "./ExtraComponents/Edit";
import { Spin } from "antd";

const { TextArea } = Input;

const Announcement = () => {
  const [text, setText] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const oneMonthLater = new Date(currentDate);
  oneMonthLater.setMonth(currentDate.getMonth() + 1);

  var now = new Date();

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthName[now.getMonth()];
  const day = new Date().getDate();
  const year = now.getFullYear();

  const date = `${month} ${day}, ${year}`;

  const Ann = async () => {
    if (text.trim() !== "") {
      try {
        const userCollectionRef = collection(db, "announcement");
        await addDoc(userCollectionRef, {
          text: text,
          date: date,
          Name: localStorage.getItem("name"),
          timestamp: serverTimestamp(),
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successfully Announced.",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Try Again",
          text: "Something went wrong!!",
        });
        console.error(e);
      }
      setText("");
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const userPostsCollectionRef = collection(db, "announcement");
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

    fetchAnnouncements();
  }, []);

  const handleDeleteField = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Announcement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const currentUserId = localStorage.getItem("uid");
          const userPostsCollectionRef = collection(db, "announcement");
          const docRef = doc(userPostsCollectionRef, id); // Reference to the specific document
          await deleteDoc(docRef);
          Swal.fire("Deleted!", "Announcement has been deleted.", "success");
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
    <div>
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        users={"user"}
        material={"material"}
        home={"/"}
      />
      <div className="cont">
        <div className="ann-cont">
          <span className="ann-head header">Announcements</span>
          <TextArea
            className="textarea"
            value={text}
            placeholder="Write all the Announcements here."
            onChange={(e) => setText(e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
          <div className="div-reg">
            <Button type="primary" onClick={() => Ann()} className="register">
              Announce
            </Button>
          </div>
        </div>
        {loading ? (
          <Spin className="spin" />
        ) : userPosts.length > 0 ? (
          userPosts.map((a) => (
            <div key={a.id} className="all-ann">
              <div className="all-ann">
                <div className="post">
                  <div className="top">
                    <div className="post-info">
                      <span className="name">{a.Name}</span>
                      <span className="date">{a.date}</span>
                    </div>
                    <div className="icons">
                      <div className="edit">
                        <Edit id={a.id} text={a.text} onUpdate={setUserPosts} />
                      </div>
                      <div className="delete">
                        <MdOutlineDelete
                          size={20}
                          onClick={() => {
                            handleDeleteField(a.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="ann-text">{a.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-message">
            <p>No announcements available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement;
