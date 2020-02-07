import React from "react";
import { useSelector } from "react-redux";
import Message from "./../shared/Message";
import DoughnutChart from "../shared/DoughnutChart";
import PieChart from "./../shared/PieChart";
import LineChart from "../shared/LineChart";

export const Dashboard = () => {
  const { user, isLoading } = useSelector(store => store.authReducer);
  const { inbox } = useSelector(store => store.inboxReducer);

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
      {/* Body */}
      <div className="row">
        {/* Inbox */}
        <div className="col l5 s12">
          <p>
            You have <span className="red-text">4</span> unread messages
          </p>
          <h4 className="teal-text">Inbox</h4>
          <ul className="collection inbox-widget z-depth-2">
            {inbox
              .reverse()
              .slice(0, 3)
              .map(message => (
                <Message message={message} key={message._id} />
              ))}
          </ul>
        </div>
        {/* Charts */}
        <div className="col l7 s12">
          <div className="row mt-1">
            <div className="col l6 s12">
              <DoughnutChart
                data={[65, 15, 5, 15]}
                labels={["Normal", "Vacation", "Mission", "Terminated"]}
                title="Employee Statuses"
              />
            </div>
            <div className="col l6 s12">
              <PieChart
                data={[30, 10, 15, 20, 5, 20]}
                labels={["HQ", "Riyad", "Jabra", "Bahri", "Soba", "Omdurman"]}
                title="Locations"
              />
            </div>
          </div>
          <div className="row">
            <div className="col s12 l6">
              <LineChart
                data={[520000, 495000, 610500, 431000]}
                labels={[
                  "4 Months ago",
                  "3 Months ago",
                  "2 Months ago",
                  "Last month"
                ]}
                title="Salaries"
              />
            </div>
            <div className="col s12 l6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
