import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import { db } from "../Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Spin } from "antd";

const Materials = () => {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
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
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
        material={"student-material"}
      />
      <div className="createBox">
        <div className="container">
          <div className="top-header">
            <span className="header">Study Materials</span>
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
        </div>
      </div>
    </>
  );
};

export default Materials;
