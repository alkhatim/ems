import React, { Component } from "react";
import PropTypes from "prop-types";
import M from "materialize-css";
import getLookup from "./../../services/lookups";
import messages from "../../services/messages";

export default class Autocomplete extends Component {
  label = this.props.label;
  lookup = this.props.lookup;
  id = this.props.id;
  onAutocomplete = this.props.onAutocomplete;
  state = {
    data: {},
    lookups: [],
    value: ""
  };

  handleChange = e => {
    const selected =
      this.state.lookups.find(item => item.name === e.target.value) || null;
    this.setState({
      value: e.target.value
    });
    this.id = selected ? selected._id : "";
    this.onAutocomplete(selected ? selected._id : "");
  };

  handleAutocomplete = value => {
    const selected =
      this.state.lookups.find(item => item.name === value) || null;
    this.setState({
      value: value
    });
    this.id = selected ? selected._id : "";
    this.onAutocomplete(selected ? selected._id : "");
  };

  async componentDidMount() {
    try {
      this.setState({ lookups: await getLookup(this.lookup) });
      this.state.lookups.forEach(item => {
        this.state.data[item.name] = null;
      });
      const autocomplete = document.querySelectorAll(".autocomplete");
      M.Autocomplete.init(autocomplete, {
        data: this.state.data,
        onAutocomplete: this.handleAutocomplete
      });
    } catch (error) {
      messages.error(error);
    }
  }
  render() {
    return (
      <div className="input-field">
        <input
          type="text"
          name="autocomplete"
          id="autocomplete"
          value={this.state.value}
          onChange={this.handleChange}
          className="autocomplete"
        />
        <label htmlFor="autocomplete">{this.label}</label>
      </div>
    );
  }
}

Autocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onAutocomplete: PropTypes.func.isRequired
};
