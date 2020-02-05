import React from "react";
import { useSelector } from "react-redux";

export const Dashboard = () => {
  const { user, isLoading } = useSelector(store => store.authReducer);

  return (
    <div className="container">
      <div className="row">
        {isLoading || (
          <h3>
            Welcome
            <span className="teal-text"> {user.username}</span>
          </h3>
        )}
      </div>
      <div className="row">
        <div className="col l5 s12">
          <p className="ml-1">
            You have <span className="red-text">4</span> unread messages
          </p>
          <h4 className="teal-text ml-1">Inbox</h4>
          <ul className="collection">
            <li class="collection-item">
              <h6>Omer</h6>
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
        <div className="col l7 s12"></div>
      </div>
    </div>
  );
};
