import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../../actions/inboxActions";
import PageHeader from "../../shared/PageHeader";
import PropTypes from "prop-types";
import TextInput from "./../../shared/TextInput";
import DatePicker from "../../shared/DatePicker";
import TextArea from "../../shared/TextArea";
import Multicomplete from "./../../shared/Multicomplete";

const Compose = props => {
  const dispatch = useDispatch();

  const { id } = props;
  const [message, setMessage] = useState({
    to: [],
    subject: "",
    body: "",
    deadline: ""
  });

  const { to, subject, body } = message;

  const handleChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleDateSelect = date => {
    setMessage({ ...message, deadline: date });
  };

  const handleAdd = id => {
    to.push(id);
    setMessage({ ...message, to });
  };

  const handleRemove = id => {
    setMessage({ ...message, to: to.filter(item => item !== id) });
  };

  const handleSend = () => {
    dispatch(sendMessage(message));
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
          <div className="col s8">
            <Multicomplete
              label="To:"
              lookup="User"
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          </div>
          <div className="col s4">
            <DatePicker label="Deadline" onSelect={handleDateSelect} />
          </div>
        </div>
        <TextInput
          name="subject"
          label="Subject"
          value={subject}
          onChange={handleChange}
        />
        <TextArea
          name="body"
          label="body"
          value={body}
          onChange={handleChange}
        />
      </div>
      <div className="modal-footer">
        <button
          className="modal-close btn waves-effect blue mr-1"
          onClick={handleSend}
        >
          Send <i className="fa fa-paper-plane-o"></i>
        </button>
        <button className="modal-close btn waves-effect red mr-1">
          Cancel <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
};

Compose.propTypes = {
  id: PropTypes.string.isRequired
};

export default Compose;
