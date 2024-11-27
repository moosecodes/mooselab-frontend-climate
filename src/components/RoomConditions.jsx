import React from "react";
import { dateAndTime, climateStats } from "../chart.config";

function RoomConditions({ climateData }) {
  return (
    <div>
      <h3>Current Conditions in Basement</h3>
      <small>Basement</small>
      <div>&nbsp;</div>
      {climateData.slice(0, 1).map(({ farenheit, celsius, humidity, created_at }, i) => (
        <div key={i}>
          {climateStats(farenheit, celsius, humidity)}
          <small>{dateAndTime(created_at)}</small>
        </div>
      ))}
    </div>
  );
}

export default RoomConditions;