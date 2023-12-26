import React from "react";
import Navbar from "../CommonComp/Navbar";
import Photo from "../assets/group-photo.png";

const Home = () => {
  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
        material={"student-material"}
      />
      <div>
        <img src={Photo} alt="group-photo" className="group-photo" />
      </div>
    </div>
  );
};

export default Home;
