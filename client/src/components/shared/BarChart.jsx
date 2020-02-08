import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

const BarChart = props => {
  const { title, data, height, width } = props;

  return (
    <Bar
      data={{
        datasets: [
          {
            data,
            label: title,
            backgroundColor: [
              "rgba(207, 0, 15, 0.8)",
              "rgba(217, 202, 24, 0.8)",
              "rgba(25, 181, 254, 0.8)"
            ]
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
              labels: ["1-3 months", "3-6 months", "6-12 months"]
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }}
    />
  );
};

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export default BarChart;
