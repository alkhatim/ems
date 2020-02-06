import React from "react";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
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
        <div className="col m5 s12">
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
        <div className="col m7 s12">
          <div className="row mt-1">
            <div className="col s12 l6">
              <Doughnut
                data={{
                  datasets: [
                    {
                      data: [60, 15, 5, 20],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(75, 192, 192, 0.8)"
                      ]
                    }
                  ],
                  labels: ["Normal", "Vacation", "Mission", "Terminated"]
                }}
                width={100}
                height={75}
                options={{
                  animation: {
                    duration: 2000
                  },
                  legend: {
                    position: "bottom"
                  },
                  title: {
                    display: true,
                    position: "top",
                    text: "Employees' Status"
                  }
                }}
              />
            </div>
            <div className="col s12 l6"></div>
          </div>
          <div className="row">
            <div className="col s12 l6"></div>
            <div className="col s12 l6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
