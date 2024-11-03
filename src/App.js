import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import { apiBaseUrl, updateInterval, chartOpts, dateAndTime, climateStats, chartData } from './myConfig'

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler);

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setWeatherData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, updateInterval);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {weatherData.length > 0 ? (
        <>
          <center>
            <h1>Basement Climate</h1>
            {error && <p>Error: {error}</p>}
          </center>

          <Line data={chartData(weatherData)} options={chartOpts} />

          <center>
            <h2>Latest Readings</h2>
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
