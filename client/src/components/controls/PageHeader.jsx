import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PageHeader = props => {
  const { title, icon, color, url, actions } = props;

  return (
    <div className="row mb-0 page-header valign-wrapper">
      <div className="col s9 l11">
        <Link to={url} className="fs-xxxl ml-1" {...props}>
          <i className={color + " " + icon}></i>
          <span className={"ml-1 flow-text " + color}>{title}</span>
        </Link>
      </div>
      {/* Action buttons */}
      <div className="col s3 l1">
        {actions &&
          actions.map(action => (
            <i
              key={action.label}
              className={"action-button " + action.icon + " mr-1"}
              title={action.label}
              onClick={action.onClick}
            ></i>
          ))}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  actions: PropTypes.array
};

export default PageHeader;
