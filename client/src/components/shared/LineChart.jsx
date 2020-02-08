import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

const LineChart = props => {
  const { title, data, labels, height, width } = props;

  return (
    <Line
      data={{
        datasets: [
          {
            data,
            label: title,
            backgroundColor: "rgba(58, 83, 215, 0.5)"
          }
        ]
      }}
      height={height || 80}
      width={width || 100}
      options={{
        animation: {
          duration: 2000
        },
        scales: {
          xAxes: [
            {
              type: "category",
              ticks: {
                fontSize: 10
              },
              labels
            }
          ]
        }
      }}
    />
  );
};

LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export default LineChart;
