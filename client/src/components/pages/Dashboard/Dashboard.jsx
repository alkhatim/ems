import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadInbox, readMessage } from "../../../actions/inboxActions";
import Message from "../../controls/Message";
import DoughnutChart from "../../controls/DoughnutChart";
import PieChart from "../../controls/PieChart";
import LineChart from "../../controls/LineChart";
import BarChart from "../../controls/BarChart";

export const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInbox());
  }, [dispatch]);

  const { user, isLoading } = useSelector((store) => store.authReducer);
  const { inbox } = useSelector((store) => store.inboxReducer);

  const handleMessageClick = (message) => {
    if (message.read === true) return;
    dispatch(readMessage(message._id));
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="row">
        {isLoading || (
          <h3>
            Welcome
            <Link to="/profile" className="teal-text">
              {" "}
              {user.username}
            </Link>
          </h3>
        )}
      </div>
      {/* Body */}
      <div className="row">
        {/* Inbox */}
        <div className="col l5 s12">
          <p>
            You have&nbsp;
            <span className="red-text">
              {inbox.filter((message) => message.read === false).length || "no"}
            </span>
            &nbsp;unread messages
          </p>
          <Link to="/inbox" className="teal-text fs-xxxxxl">
            Inbox
          </Link>
          <ul className="collection inbox-widget z-depth-1">
            {inbox.slice(0, 3).map((message) => (
              <Message
                message={message}
                key={message._id}
                onMessageClick={handleMessageClick}
              />
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
              <LineChart
                data={[520000, 495000, 610500, 431000]}
                labels={[
                  "4 Months ago",
                  "3 Months ago",
                  "2 Months ago",
                  "Last month",
                ]}
                title="Salary Report"
              />
            </div>
          </div>
          <div className="row">
            <div className="col l6 s12">
              <PieChart
                data={[30, 20, 15, 20, 15]}
                labels={["HQ", "Riyad", "Jabra", "Bahri", "Soba"]}
                title="Locations"
              />
            </div>
            <div className="col l6 s12">
              <BarChart data={[4, 6, 13]} title="Contracts Expiration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
