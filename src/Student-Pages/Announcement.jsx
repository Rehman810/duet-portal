import Navbar from "../CommonComp/Navbar";
import React, { useState, useEffect } from "react";
// import "./Announcement.css";
import { db } from "../Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Spin } from "antd";

const Announcement = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
      />
      <div className="cont">
        <div className="ann-cont">
          <span className="ann-head header">Announcements</span>
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
