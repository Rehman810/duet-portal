import React, { useState } from "react";
import Logo from "../assets/duet.png";
import LoadingBar from "react-top-loading-bar";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { Dropdown } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";

function NavbarFunc(props) {
  const navigate = useNavigate();
  const { attendance, announcement, material, users, classes, home } = props;
  const [progress, setProgress] = useState(0);
  const attendanceFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/${attendance}`);
    }, 500);
  };
  const announcementFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/${announcement}`);
    }, 500);
  };
  const materialFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/${material}`);
    }, 500);
  };
  const userFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/${users}`);
    }, 500);
  };
  const classesFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/${classes}`);
    }, 500);
  };
  const homeFunc = () => {
    setProgress(100);
    setTimeout(() => {
      navigate(`/`);
    }, 500);
  };
  const signOutFunc = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem("uid");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setProgress(100);
        setTimeout(() => {
          navigate(`/login`);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const items = [
    {
      label: <span onClick={homeFunc}>Home</span>,
      key: "0",
    },
    {
      label: <span onClick={announcementFunc}>Announcements</span>,
      key: "1",
    },

    {
      label: <span onClick={materialFunc}>Materials</span>,
      key: "2",
    },
    {
      label: <span onClick={userFunc}>User</span>,
      key: "3",
    },
    {
      label: <span onClick={classesFunc}>Classes</span>,
      key: "4",
    },
    {
      label: <span onClick={attendanceFunc}>Attendance</span>,
      key: "5",
    },
    {
      type: "divider",
    },
    {
      label: (
        <span onClick={signOutFunc} style={{ color: "red" }}>
          SignOut
        </span>
      ),
      key: "6",
    },
  ];
  return (
    <>
      <div className="main">
        <LoadingBar
          color="blue"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <div className="left">
          <img
            src={Logo}
            style={{ width: "50px", height: "40px" }}
            alt="logo"
          />
          <span className="duet">
            DAWOOD UNIVERSITY OF ENGINEERING AND TECHNOLOGY
          </span>
        </div>
        <div className="right">
          <span onClick={homeFunc} className="text">
            Home
          </span>
          <span onClick={attendanceFunc} className="text">
            Attendance
          </span>
          <span onClick={announcementFunc} className="text">
            Announcements
          </span>
          <span onClick={materialFunc} className="text">
            Materials
          </span>
          <span onClick={userFunc} className="text">
            User
          </span>
          <span onClick={classesFunc} className="text">
            Classes
          </span>
          <span onClick={signOutFunc} className="text signout">
            SignOut
          </span>
        </div>
        <div className="ham">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <RxHamburgerMenu color="black" size={20} />
          </Dropdown>
        </div>
      </div>
    </>
  );
}

export default NavbarFunc;
