import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import { apiBaseUrl, updateInterval, chartData, chartOpts, dateAndTime, climateStats } from './myConfig'

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler, zoomPlugin);

const App = () => {
  const chartRef = useRef(null);
  const [weatherData, setWeatherData] = useState([]);

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchClimateReading = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setWeatherData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchLocalWeather = async () => {
    try {
      console.log(process.env.REACT_APP_OW_API_KEY)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.REACT_APP_OW_LAT}&lon=${process.env.REACT_APP_OW_LONG}&units=imperial&appid=${process.env.REACT_APP_OW_API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleZoomIn = () => {
    chartRef.current.zoom(1.2); // Zoom in by a factor of 1.2
  };

  const handleZoomOut = () => {
    chartRef.current.zoom(0.8); // Zoom out by a factor of 0.8
  };

  const handleResetZoom = () => {
    chartRef.current.resetZoom(); // Reset zoom
  };

  const handlePanLeft = () => {
    chartRef.current.pan({ x: -50, y: 0 }); // Pan left
  };

  const handlePanRight = () => {
    chartRef.current.pan({ x: 50, y: 0 }); // Pan right
  };

  useEffect(() => {
    fetchClimateReading();
    const climateIntervalId = setInterval(fetchClimateReading, updateInterval);

    fetchLocalWeather();

    return () => {
      clearInterval(climateIntervalId);
    }
  }, []);

  return (
    <div>
      {weatherData.length > 0 ? (
        <>
          <center>
            <h1>Basement Climate</h1>
            {error && <p>Error: {error}</p>}
          </center>

          <center>
            <h3>Current Conditions</h3>
            {weatherData.slice(0, 1).map(({ farenheit, celsius, humidity, created_at }, i) => (
              <div key={i}>
                {climateStats(farenheit, celsius, humidity)}
                {dateAndTime(created_at)}
                <br />
                <br />
                <hr />
              </div>
            ))}
          </center>

          <center>
            {weather ? (
              <div>
                <h3>Weather in {weather.name}</h3>
                <small>Conditions: {weather.weather[0].main} ({weather.weather[0].description})</small><br />
                <small>Temperature: <b>{weather.main.temp}°F</b> ({weather.main.temp_min} - {weather.main.temp_max} F°)</small><br />
                <small>Feels Like: {weather.main.feels_like}°F</small><br />
                <small>Humidity: {weather.main.humidity}%</small><br />
                <small>{new Date(weather.dt * 1000).toLocaleString()}</small><br />
              </div>
            ) : (
              <p>Loading weather data...</p>
            )}
          </center>

          <Line ref={chartRef} data={chartData(weatherData)} options={chartOpts} />

          <center style={{ marginTop: '10px' }}>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
            <button onClick={handleResetZoom}>Reset Zoom</button>
            <button onClick={handlePanLeft}>Pan Left</button>
            <button onClick={handlePanRight}>Pan Right</button>
          </center>

          <center>
            <h3>Latest Readings</h3>
            {weatherData.slice(0, 6).map(({ farenheit, celsius, humidity, created_at }, i) => (
              <div key={i}>
                {climateStats(farenheit, celsius, humidity)}
                {dateAndTime(created_at)}
                <br />
                <hr />
              </div>
            ))}
          </center>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
