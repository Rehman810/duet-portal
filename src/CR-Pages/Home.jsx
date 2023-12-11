import React from "react";
import Navbar from "../CommonComp/Navbar";
import Photo from "../assets/group-photo.png";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        classes={"classes"}
        users={"user"}
        material={"material"}
      />
      <div>
        <img src={Photo} alt="gropu-photo" className="group-photo" />
      </div>
    </div>
  );
};

export default Home;
