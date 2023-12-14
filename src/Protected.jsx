import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const role = localStorage.getItem("role");

    console.log("Role:", role);
    console.log("Pathname:", location.pathname);

    if (!uid) {
      navigate("/login");
    } else if (role === "cr") {
      // Handling navigation for CR (Class Representative) role
      console.log("Navigating for CR role");

      // List of routes that "cr" users should not access
      const restrictedRoutes = [
        "/student-attendance",
        "/student-material",
        "/student-announcement",
        "/student",
      ];

      if (restrictedRoutes.includes(location.pathname)) {
        navigate("/"); // Redirect to another route or homepage
        return;
      }

      // Add more navigation logic for other CR routes if needed
      // ...
    } else if (role === "student") {
      // Handling navigation for Student role
      console.log("Navigating for Student role");

      // List of routes that "student" users should not access
      const restrictedRoutes = [
        "/attendance",
        "/announcement",
        "/material",
        "/user",
        "/",
      ];

      if (restrictedRoutes.includes(location.pathname)) {
        navigate("/student"); // Redirect to another route or student dashboard
        return;
      }

      // Add more navigation logic for other student routes if needed
      // ...
    }
  }, []); // Empty dependencies array to run the effect only once

  return (
    <div>
      <Component />
    </div>
  );
};

export default Protected;
