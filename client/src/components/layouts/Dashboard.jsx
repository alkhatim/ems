import React from "react";
import { useSelector } from "react-redux";
import defaultPic from "../../img/defaultProfile.png";

export const Dashboard = () => {
  const { user, isLoading } = useSelector(store => store.authReducer);

  return (
    <div className="container">
      {/* Header */}
      <div className="row">
        {isLoading || (
          <h3>
            Welcome
            <span className="teal-text"> {user.username}</span>
          </h3>
        )}
      </div>
      <div className="row">
        {/* Inbox */}
        <div className="col l5 s12">
          <p>
            You have <span className="red-text">4</span> unread messages
          </p>
          <h4 className="teal-text">Inbox</h4>
          <ul className="collection">
            <li class="collection-item" style={{ cursor: "pointer" }}>
              <div className="row mb-1">
                <div className="col s2">
                  <img
                    src={defaultPic}
                    alt=""
                    className="circle responsive-img right"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginTop: "0.5rem"
                    }}
                  />
                </div>
                <div className="col s10">
                  <h6 className="left">Omer</h6>
                </div>
              </div>
              <span>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae
                exercitationem nulla suscipit expedita fugit voluptates incidunt
                aspernatur placeat et explicabo?
              </span>
            </li>
            <li class="collection-item">Alvin</li>
            <li class="collection-item">Alvin</li>
            <li class="collection-item">Alvin</li>
          </ul>
        </div>
        {/* Charts */}
        <div className="col l7 s12"></div>
      </div>
    </div>
  );
};
