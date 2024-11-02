import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler);

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/data');
      setWeatherData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: weatherData.map((reading) => reading.created_at), // Assuming you have a created_at field
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.map((reading) => ({
          x: new Date(reading.created_at), // Convert created_at to Date object
          y: reading.celsius,
        })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Temperature (°F)',
        data: weatherData.map((reading) => ({
          x: new Date(reading.created_at), // Convert created_at to Date object
          y: reading.farenheit,
        })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time', // Set x-axis type to time
        time: {
          unit: 'minute', // Change this to 'hour', 'day', etc., as needed
          tooltipFormat: 'HH:mm', // Format for tooltips
          displayFormats: {
            minute: 'MMM d, HH:mm', // Display format for the x-axis labels
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature',
        },
      },
    },
  };

  return (
    <div>
      {weatherData.length > 0 ? (
        <>
          <center>
            <h1>Basement Climate</h1>
            {error && <p>Error: {error}</p>}
          </center>
          <Line data={chartData} options={options} />
          <center>
            <h2>Latest Readings</h2>
            <div>
              {weatherData.slice(-20).map((reading, index) => (
                <div key={index}>
                  <div>
                    <b>{reading.farenheit} °F</b>
                    <small> | {reading.celsius} °C</small><br />
                    <small>Humidity: {reading.humidity} %</small>
                  </div>
                  <small>
                    {new Date(reading.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} @ {new Date(reading.created_at).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}
                  </small>
                  <br />
                  <br />
                </div>
              ))}
            </div>
          </center>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
