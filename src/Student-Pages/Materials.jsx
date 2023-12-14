import React from "react";
import Navbar from "../CommonComp/Navbar";

const Materials = () => {
  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
      />
    </div>
  );
};

export default Materials;
