import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const location = useLocation();
  // const { authToken } = useStudentContext();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const role = localStorage.getItem("role");

    if (!uid) {
      navigate("/login");
    } else if (role === "cr") {
      // Handling navigation for CR (Class Representative) role

      // List of routes that "cr" users should not access
      const restrictedRoutes = [
        "/student-attendance",
        "/student-material",
        "/student-announcement",
        "/student",
      ];

      if (restrictedRoutes.includes(location.pathname)) {
        navigate("/");
        return;
      }

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is logged in");
        } else {
          signOut(auth).then(() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
          });
        }
      });
    } else if (role === "student") {
      // List of routes that "student" users should not access
      const restrictedRoutes = [
        "/attendance",
        "/announcement",
        "/material",
        "/user",
        "/",
      ];

      if (restrictedRoutes.includes(location.pathname)) {
        navigate("/student");
        return;
      }

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is logged in");
        } else {
          signOut(auth).then(() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default Protected;
