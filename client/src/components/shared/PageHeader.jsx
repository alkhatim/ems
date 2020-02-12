import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PageHeader = props => {
  const { title, icon, color, url } = props;

  return (
    <div className="row mb-0 page-header valign-wrapper">
      <div className="col s9">
        <Link to={url} className="fs-xxxl ml-1" {...props}>
          <i className={color + " " + icon}></i>
          <span className={"ml-1 flow-text " + color}>{title}</span>
        </Link>
      </div>
      {/* Action buttons */}
      <div className="col s3"></div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default PageHeader;
