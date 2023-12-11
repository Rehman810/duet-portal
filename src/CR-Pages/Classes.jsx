import React from "react";
import Navbar from "../CommonComp/Navbar";

const Classes = () => {
  return (
    <div>
      {" "}
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        classes={"classes"}
        users={"user"}
        material={"material"}
        home={"/"}
      />
    </div>
  );
};

export default Classes;
