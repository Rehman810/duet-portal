import React from "react";
import Navbar from "../CommonComp/Navbar";

const Attendance = () => {
  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
        material={"student-material"}
      />
    </div>
  );
};

export default Attendance;
