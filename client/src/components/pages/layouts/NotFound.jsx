import React from "react";

export const NotFound = () => {
  return (
    <div className="error-page center">
      <i className="fas fa-frown fa-7x mb-1"></i>
      <h2>
        <span className="red-text">Error 404 </span>Not found
      </h2>
    </div>
  );
};

export default NotFound;
