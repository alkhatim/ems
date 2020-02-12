import React, { useState } from "react";
import PageHeader from "../../shared/PageHeader";
import PropTypes from "prop-types";
import Autocomplete from "../../shared/Autocomplete";

const Compose = props => {
  const { id } = props;
  const [message, setMessage] = useState({
    to: "",
    subject: "",
    body: "",
    deadline: "",
    attachment: ""
  });

  const handleChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleAutocomplete = to => {
    setMessage({ ...message, to });
  };

  return (
    <div id={id} className="modal">
      <div className="modal-content">
        <PageHeader
          title="Compose"
          icon="fa fa-inbox"
          color="blue-text text-darken-2"
          url="/inbox"
          onClick={e => e.preventDefault()}
        />
        <div className="row">
          <Autocomplete
            label="To:"
            lookup="User"
            id={message.to}
            onAutocomplete={handleAutocomplete}
          />
        </div>
      </div>
      <div className="modal-footer"></div>
    </div>
  );
};

Compose.propTypes = {
  id: PropTypes.string.isRequired
};

export default Compose;
