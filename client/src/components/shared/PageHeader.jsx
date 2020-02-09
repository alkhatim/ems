import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PageHeader = props => {
  const { title, icon, color, url } = props;

  return (
    <div className="row page-header valign-wrapper">
      <div className="col s12">
        <Link to={url} className="fs-xxxl">
          <i className={icon + " " + color + "-text"}></i>
          <span className={color + "-text" + " ml-1"}>{title}</span>
        </Link>
      </div>
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
