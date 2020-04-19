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
              "rgb(220, 0, 15)",
              "rgb(237, 217, 24)",
              "rgb(25, 171, 254)",
              "rgb(255, 120, 80)",
              "rgb(200, 100, 100)",
              "rgb(100, 255, 100)"
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
