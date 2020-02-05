import React from "react";
import { useSelector } from "react-redux";

export const Dashboard = () => {
  const user = useSelector(state => state);
  return (
    <div className="container">
      <div className="row">
        Welcome <span className="teal-text">{user.username}</span>
      </div>
    </div>
  );
};
