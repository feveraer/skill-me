import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function RadarChart({
  rawData,
  skillPercentage,
  skillName,
  label,
  backgroundColor,
  borderColor,
  borderWidth,
  pointBackgroundColor,
  pointBorderColor,
  pointHoverBackgroundColor,
  pointHoverBorderColor,
  borderDash,
  borderDashOffset,
  angleLines,
  grid,
  pointLabels,
  ticks,
  ShowLegend,
  maxScale,
}) {
  const MyData = Object.entries(rawData).map(([key, value]) => [
    value[skillName],
  ]);
  const MyLabels = Object.entries(rawData).map(([key, value]) => [
    value[skillPercentage],
  ]);
  const newData = MyLabels.map((item) => {
    return item[0];
  });

  const data = {
    labels: MyData,
    datasets: [
      {
        label: label,
        data: newData,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointHoverBackgroundColor: pointHoverBackgroundColor,
        pointHoverBorderColor: pointHoverBorderColor,
        borderDash: borderDash,
        borderDashOffset: borderDashOffset,
      },
    ],
  };
  const config = {
    type: "radar",
    data,

    options: {
      plugins: {
        legend: ShowLegend,

        labels: {
          color: "blue",
        },
      },
      scales: {
        r: {
          min: 0,
          max: maxScale ? maxScale : 100,
          angleLines: {
            color: angleLines,
          },
          grid: {
            color: grid,
          },
          pointLabels: {
            color: pointLabels,
          },
          ticks: {
            color: ticks,
          },
        },
      },
    },
  };

  return <Radar {...config} />;
}
