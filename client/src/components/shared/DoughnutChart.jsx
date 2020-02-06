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
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(80, 192, 192, 0.8)",
              "rgba(200, 192, 192, 0.8)",
              "rgba(200, 150, 255, 0.8)",
              "rgba(255, 120, 80, 0.8)",
              "rgba(255, 100, 100, 0.8)",
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
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default DoughnutChart;
