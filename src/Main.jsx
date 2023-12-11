import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./CommonPages/Login";
import SignUp from "./CommonPages/SignUp";
import HomeStudent from "./Student-Pages/Home";
import Home from "./CR-Pages/Home";
import Attendance from "./CR-Pages/Attendance";
import AttendanceStd from "./Student-Pages/Attendance";
import Announcement from "./CR-Pages/Announcement";
import AnnouncementStd from "./Student-Pages/Announcement";
import AddUsers from "./CR-Pages/AddUsers";
import Classes from "./CR-Pages/Classes";
import Materials from "./CR-Pages/materials";
import Protected from "./Protected";

const Main = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Protected Component={Login} />} />
          <Route path="/signup" element={<Protected Component={SignUp} />} />
          <Route path="/" element={<Protected Component={Home} />} />
          <Route
            path="/student"
            element={<Protected Component={HomeStudent} />}
          />
          <Route
            path="/attendance"
            element={<Protected Component={Attendance} />}
          />
          <Route
            path="/material"
            element={<Protected Component={Materials} />}
          />
          <Route path="/classes" element={<Protected Component={Classes} />} />
          <Route path="/user" element={<Protected Component={AddUsers} />} />
          <Route
            path="/student-attendance"
            element={<Protected Component={AttendanceStd} />}
          />
          <Route
            path="/announcement"
            element={<Protected Component={Announcement} />}
          />
          <Route
            path="/student-announcement"
            element={<Protected Component={AnnouncementStd} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Main;
