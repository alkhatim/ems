import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = props => {
  const { title, data, labels, height, width } = props;

  return (
    <Doughnut
      data={{
        datasets: [
          {
            data,
            backgroundColor: [
              "rgba(0, 177, 106, 0.8)",
              "rgba(54, 162, 255, 0.8)",
              "rgba(255, 200, 80, 0.8)",
              "rgba(255, 50, 50, 0.8)",
              "rgba(200, 192, 192, 0.8)",
              "rgba(200, 150, 255, 0.8)",
              "rgba(255, 120, 80, 0.8)",
              "rgba(200, 100, 100, 0.8)",
              "rgba(100, 255, 100, 0.8)"
            ]
          }
        ],
        labels
      }}
      height={height || 80}
      width={width || 100}
      options={{
        animation: {
          duration: 2000
        },
        legend: {
          position: "bottom"
        },
        title: {
          display: true,
          position: "top",
          fontSize: 15,
          text: title
        }
      }}
    />
  );
};

DoughnutChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export default DoughnutChart;
