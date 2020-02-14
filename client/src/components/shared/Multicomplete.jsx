import React, { Component } from "react";
import PropTypes from "prop-types";
import M from "materialize-css/dist/js/materialize.min.js";
import getLookup from "./../../services/lookups";
import messages from "../../services/messages";

export default class Multicomplete extends Component {
  label = this.props.label;
  lookup = this.props.lookup;
  onAdd = this.props.onAdd;
  onRemove = this.props.onRemove;
  state = {
    data: {},
    lookups: []
  };

  handleChipAdd = (e, chip) => {
    const chipText = chip.textContent.slice(0, -5);
    const selected =
      this.state.lookups.find(item => item.name === chipText) || "";
    this.onAdd(selected._id);
  };

  handleChipDelete = (e, chip) => {
    const chipText = chip.textContent.slice(0, -5);
    const selected =
      this.state.lookups.find(item => item.name === chipText) || "";
    this.onRemove(selected._id);
  };

  async componentDidMount() {
    try {
      this.setState({ lookups: await getLookup(this.lookup) });
      this.state.lookups.forEach(item => {
        this.state.data[item.name] = null;
      });
      const multicomplete = document.querySelectorAll(".chips");
      M.Chips.init(multicomplete, {
        placeholder: this.label,
        autocompleteOptions: { data: this.state.data },
        onChipAdd: this.handleChipAdd,
        onChipDelete: this.handleChipDelete
      });
    } catch (error) {
      messages.error(error);
    }
  }
  render() {
    return (
      <div className="input-field">
        <div
          id="multicomplete"
          className="chips chips-autocomplete chips-placeholder"
        ></div>
      </div>
    );
  }
}

Multicomplete.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};
