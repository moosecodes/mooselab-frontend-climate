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
    <>
      <center>
        <h1>MooseLab Climate Reading</h1>
        {error && <p>Error: {error}</p>}
        {weatherData ? (
          <small>
            <p>{new Date(weatherData[0].created_at).toLocaleTimeString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <h2><b>{weatherData[0].farenheit} ° F</b></h2>
            <h2><b>{weatherData[0].celsius} ° C</b></h2>
          </small>
        ) : (
          <p>Loading...</p>
        )}
      </center>
      <center>
        hello
      </center>
    </>

  );
};

export default App;
