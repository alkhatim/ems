import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";

const DataTable = props => {
  const { columns, data } = props;
  return (
    <MaterialTable
      title=""
      columns={columns}
      data={data}
      options={{
        search: false,
        exportButton: true,
        headerStyle: {
          color: "#494444",
          fontWeight: "bold",
          borderBottom: "solid",
          borderColor: "#494444",
          fontSize: 15
        }
      }}
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
