import React from "react";
import Navbar from "../CommonComp/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
      />
    </div>
  );
};

export default Home;
