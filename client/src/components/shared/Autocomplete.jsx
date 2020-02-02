import React, { Component } from "react";
import PropTypes from "prop-types";
import M from "materialize-css/dist/js/materialize.min.js";
import getLookup from "./../../services/lookups";
import messages from "../../services/messages";

export default class Autocomplete extends Component {
  label = this.props.label;
  lookup = this.props.lookup;
  onSelect = this.props.onSelect;
  data = {};
  state = {
    lookups: [],
    value: "",
    id: ""
  };

  onChange = e => {
    const selected =
      this.state.lookups.find(item => item.name === e.target.value) || null;
    this.setState({
      value: e.target.value,
      id: selected ? selected._id : null
    });
    this.onSelect(selected ? selected._id : null);
  };

  onAutocomplete = value => {
    const selected =
      this.state.lookups.find(item => item.name === value) || null;
    this.setState({
      value: value,
      id: selected ? selected._id : null
    });
    this.onSelect(selected ? selected._id : null);
  };

  async componentDidMount() {
    try {
      this.setState({ lookups: await getLookup(this.lookup) });
      this.state.lookups.forEach(item => {
        this.data[item.name] = null;
      });
      const autocomplete = document.querySelectorAll(".autocomplete");
      M.Autocomplete.init(autocomplete, {
        data: this.data,
        onAutocomplete: this.onAutocomplete
      });
    } catch (error) {
      messages.error(error);
    }
  }
  render() {
    return (
      <div className="row">
        <div className="input-field">
          <input
            type="text"
            name="autocomplete"
            id="autocomplete"
            value={this.state.value}
            onChange={this.onChange}
            className="autocomplete"
            {...this.props}
          />
          <label htmlFor="autocomplete">{this.label}</label>
        </div>
      </div>
    );
  }
}

Autocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

// USE:
// <Autocomplete onSelect={onSelect} label="State" lookup="State" />;
// const [employeeId, setemployeeId] = useState("");

// const onSelect = id => {
//   setemployeeId(id);
// };
