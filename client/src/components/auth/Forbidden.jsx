import React from "react";

export const Forbidden = () => {
  return (
    <div className="forbidden center">
      <i className="fas fa-frown fa-7x"></i>
      <h1>
        <span className="red-text">Error 403 </span>Forbidden
      </h1>
      <h5>You don't have the required permissions !</h5>
    </div>
  );
};
