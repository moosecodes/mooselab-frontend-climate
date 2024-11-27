import React from "react";
import { dateAndTime } from "../chart.config";

function WeatherConditions({ localWeatherData }) {
  return (
    <>
    {localWeatherData[0] ? (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Weather in {localWeatherData[0].name}</h3>
        <small>{localWeatherData[0].conditions} - {localWeatherData[0].description}</small>
        <div>&nbsp;</div>
        <div><b>{localWeatherData[0].farenheit}°F</b> <small>(Feels Like: {localWeatherData[0].feels_like}°F)</small>
        </div>
        <small>Humidity: {localWeatherData[0].humidity}%</small>
        <small>{dateAndTime(localWeatherData[0].created_at)}</small>

      </div>
    ) : (
      <p>Loading weather data...</p>
    )}</>
  );
}

export default WeatherConditions;