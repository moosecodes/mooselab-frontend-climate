import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
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
    // Fetch data on initial render
    fetchWeatherData();

    // Set up interval to fetch data every minute (60000 ms)
    const intervalId = setInterval(fetchWeatherData, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Weather Data</h1>
      {error && <p>Error: {error}</p>}
      {weatherData ? (
        <div>
          <p>Celcius: {weatherData[0].celsius}</p>
          <p>Fahrenheit: {weatherData[0].farenheit}</p>
          <p>Timestamp: {weatherData[0].created_at}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
