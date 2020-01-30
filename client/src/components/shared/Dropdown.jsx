import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import getLookup from "./../../services/lookups";

const Dropdown = props => {
  const { label, lookup } = props;
  const [data, setData] = useState([]);

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setData(await getLookup(lookup));
    };
    fetchData();
  });

  return (
    <div className="row">
      <div className="input-filed">
        <FormControl className={classes.formControl}>
          <InputLabel id="dropdownLabel">{label}</InputLabel>
          <Select labelId="dropdownLable" id="dropdown" {...props}>
            <MenuItem value="" className="grey-text">
              {label}
            </MenuItem>
            {data.map(item => (
              <MenuItem value={item._id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired
};

export default Dropdown;
