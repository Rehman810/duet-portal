import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./CommonPages/Login";
import HomeStudent from "./Student-Pages/Home";
import Home from "./CR-Pages/Home";
import Attendance from "./CR-Pages/Attendance";
import AttendanceStd from "./Student-Pages/Attendance";
import Announcement from "./CR-Pages/Announcement";
import AnnouncementStd from "./Student-Pages/Announcement";
import AddUsers from "./CR-Pages/AddUsers";
import Materials from "./CR-Pages/materials";
import Protected from "./Protected";
import StdMaterials from "./Student-Pages/Materials";
import IndividualAttendance from "./CR-Pages/IndividualStdAttendance";
import NotFound from "./NotFound";

const Main = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Protected Component={Login} />} />

          {/* Class Representative Routes */}
          <Route path="/" element={<Protected Component={Home} />} />
          <Route
            path="/attendance"
            element={<Protected Component={Attendance} />}
          />
          <Route
            path="/announcement"
            element={<Protected Component={Announcement} />}
          />
          <Route
            path="/material"
            element={<Protected Component={Materials} />}
          />
          <Route
            path="ind-std-attendance"
            element={<Protected Component={IndividualAttendance} />}
          />
          <Route path="/user" element={<Protected Component={AddUsers} />} />

          {/* Student Routes */}
          <Route
            path="/student-material"
            element={<Protected Component={StdMaterials} />}
          />
          <Route
            path="/student-attendance"
            element={<Protected Component={AttendanceStd} />}
          />

          <Route
            path="/student"
            element={<Protected Component={HomeStudent} />}
          />
          <Route
            path="/student-announcement"
            element={<Protected Component={AnnouncementStd} />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Main;
