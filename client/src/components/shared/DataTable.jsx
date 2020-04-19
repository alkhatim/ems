import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";

const DataTable = props => {
  const { columns, data } = props;
  return (
    <MaterialTable
      columns={columns}
      data={data}
      options={{
        toolbar: false,
        headerStyle: {
          color: "#494444",
          fontWeight: "bold",
          borderBottom: "solid",
          borderColor: "#494444",
          fontSize: 15
        }
      }}
      {...props}
    />
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  actions: PropTypes.array
};

export default DataTable;

// column => title, field, render(rowData)
// data => any object
// actions => icon, tooltip, onClick(event, rowData)
