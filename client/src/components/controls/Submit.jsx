import React from "react";

export const Submit = ({ label }) => {
  return (
    <div className="input-field">
      <button type="submit" className="btn btn-large">
        {label}
      </button>
    </div>
  );
};
