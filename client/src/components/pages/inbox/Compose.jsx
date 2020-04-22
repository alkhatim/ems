import React, { useState } from "react";
import { useDispatch } from "react-redux";
import types from "../../../actions/types";
import { sendMessage } from "../../../actions/inboxActions";
import messages from "../../../services/messages";
import PageHeader from "../../controls/PageHeader";
import PropTypes from "prop-types";
import TextInput from "../../controls/TextInput";
import DatePicker from "../../controls/DatePicker";
import TextArea from "../../controls/TextArea";
import Multicomplete from "../../controls/Multicomplete";

const Compose = (props) => {
  const { id } = props;
  const [message, setMessage] = useState({
    to: [],
    subject: "",
    body: "",
  });

  const { to, subject, body } = message;

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date) => {
    setMessage({ ...message, deadline: date });
  };

  const handleAdd = (id) => {
    setMessage({ ...message, to: to.concat(id) });
  };

  const handleRemove = (id) => {
    setMessage({ ...message, to: to.filter((item) => item !== id) });
  };

  const handleSend = async () => {
    try {
      await sendMessage(message);
      dispatch({ type: types.MESSAGE_SENT });
      messages.success("Message Sent");
    } catch (error) {
      dispatch({ type: types.MESSAGE_SEND_FAILED });
      messages.error(error);
    }
  };

  return (
    <div id={id} className="modal">
      <div className="modal-content">
        <PageHeader
          title="Compose"
          icon="fa fa-inbox"
          color="blue-text text-darken-2"
          url="/inbox"
          onClick={(e) => e.preventDefault()}
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
        <div className="row">
          <div className="col s12">
            <TextInput
              name="subject"
              label="Subject"
              value={subject}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <TextArea
              name="body"
              label="body"
              value={body}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="modal-footer mb-1">
        <button className="modal-close btn waves-effect red mr-1">
          Cancel <i className="fa fa-times"></i>
        </button>
        <button
          className="modal-close btn waves-effect blue darken-2 mr-2"
          onClick={handleSend}
        >
          Send <i className="fa fa-paper-plane-o"></i>
        </button>
      </div>
    </div>
  );
};

Compose.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Compose;
