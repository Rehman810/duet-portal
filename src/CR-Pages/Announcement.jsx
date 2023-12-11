import React, { useState } from "react";
import Navbar from "../CommonComp/Navbar";
import { Input } from "antd";
import "./Announcement.css";
import { Button } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

const { TextArea } = Input;

const Announcement = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        classes={"classes"}
        users={"user"}
        material={"material"}
        home={"/"}
      />
      <div className="cont">
        <div className="ann-cont">
          <span className="ann-head header">Announcements</span>
          <TextArea
            className="textarea"
            placeholder="Write all the Announcements here."
            onChange={(e) => setText(e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
          <div className="div-reg">
            <Button type="primary" className="register">
              Announce
            </Button>
          </div>
        </div>
        <div className="all-ann">
          <div className="post">
            <div className="top">
              <div className="post-info">
                <span className="name">Abdul Rehman</span>
                <span className="date">date</span>
              </div>
              <div className="icons">
                <div className="edit">
                  <CiEdit size={20} />
                </div>
                <div className="delete">
                  <MdOutlineDelete size={20} />
                </div>
              </div>
            </div>
            <p className="text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              eos accusamus magni rerum distinctio, unde cum alias voluptate
              laboriosam dolor facere porro aliquam corporis perferendis,
              ratione voluptates voluptatum, illum ea!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
