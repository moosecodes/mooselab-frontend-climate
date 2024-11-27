import React from "react";
import { climateStats, dateAndTime } from "../chart.config";

function LatestReadings({ climateData }) {
  return (
    <center>
    <h3>Latest Readings</h3>
    {climateData.slice(0, 6).map(({ farenheit, celsius, humidity, created_at }, i) => (
      <div key={i}>
        {climateStats(farenheit, celsius, humidity)}
        {dateAndTime(created_at)}
        <br />
        <hr />
      </div>
    ))}
  </center>
  );
}

export default LatestReadings;