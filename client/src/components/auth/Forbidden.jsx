import React from "react";

export const Forbidden = () => {
  return (
    <div className="error-page center">
      <i className="fas fa-frown fa-7x mb-1"></i>
      <h2>
        <span className="red-text">Error 403 </span>Forbidden
      </h2>
      <h5>You don't have the required permissions !</h5>
    </div>
  );
};

export default Forbidden;
