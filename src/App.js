import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import { apiBaseUrl, updateInterval, chartData, chartOpts, dateAndTime, climateStats } from './chart.config'

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler, zoomPlugin);

const App = () => {
  const chartRef = useRef(null);
  const [climateData, setClimateData] = useState([]);

  const [localWeatherData, setLocalWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const fetchClimateReading = async () => {
    try {
      const response = await axios.get(apiBaseUrl + '/weather');
      setClimateData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchLocalWeather = async () => {
    try {
      const response = await axios.get(apiBaseUrl + '/weather/local');
      setLocalWeatherData(response.data);
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
    const climateIntervalId = setInterval(fetchClimateReading, updateInterval * 10);

    fetchLocalWeather();
    const weatherIntervalId = setInterval(fetchLocalWeather, updateInterval * 10);

    return () => {
      clearInterval(climateIntervalId);
      clearInterval(weatherIntervalId);
    }
  }, []);

  return (
    <div>
      {climateData.length > 0 ? (
        <>
          <center>
            <h1>Climate Monitor</h1>
            {error && <p>Error: {error}</p>}
          </center>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
            {/* {JSON.stringify(localWeatherData, null, 2)} */}
            {localWeatherData[0] ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>Weather in {localWeatherData[0].name}</h3>
                <small>{localWeatherData[0].conditions} - {localWeatherData[0].description}</small>
                <div>&nbsp;</div>
                <div><b>{localWeatherData[0].farenheit}°F</b> <small>(Feels Like: {localWeatherData[0].feels_like}°F)</small>
                  {/* <small>({localWeatherData[0].temp_min} - {localWeatherData[0].temp_max} F°)</small> */}
                </div>
                <small>Humidity: {localWeatherData[0].humidity}%</small>
                <small>{dateAndTime(localWeatherData[0].created_at)}</small>

              </div>
            ) : (
              <p>Loading weather data...</p>
            )}

          </div>

          {localWeatherData && <Line ref={chartRef} data={chartData(climateData, localWeatherData)} options={chartOpts} />}

          <center style={{ marginTop: '10px' }}>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
            <button onClick={handleResetZoom}>Reset Zoom</button>
            <button onClick={handlePanLeft}>Pan Left</button>
            <button onClick={handlePanRight}>Pan Right</button>
          </center>

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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
