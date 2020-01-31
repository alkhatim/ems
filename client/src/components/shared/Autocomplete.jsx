import React, { Component } from "react";
import PropTypes from "prop-types";
import M from "materialize-css/dist/js/materialize.min.js";
import getLookup from "./../../services/lookups";
import messages from "../../services/messages";

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.label = this.props.label;
    this.lookup = this.props.lookup;
    this.data = {};
  }

  componentDidMount() {
    getLookup(this.lookup)
      .then(lookups => {
        const autocomplete = document.querySelectorAll(".autocomplete");
        lookups.forEach(item => {
          this.data[item.name] = null;
        });
        M.Autocomplete.init(autocomplete, {
          data: this.data
        });
      })
      .catch(error => messages.error(error));
  }
  render() {
    return (
      <div className="row">
        <div className="input-field">
          <input
            type="text"
            name="autocomplete"
            id="autocomplete"
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
  lookup: PropTypes.string.isRequired
};
