import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
  const { Component } = props;
  let navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/login");
    }
  });
  return (
    <div>
      <Component />
    </div>
  );
};

export default Protected;
