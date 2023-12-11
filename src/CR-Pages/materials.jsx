import React from "react";
import Navbar from "../CommonComp/Navbar";

const materials = () => {
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

export default materials;
