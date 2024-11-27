import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherReadings = () => {
  const [localWeatherData, setLocalWeatherData] = useState(null);

  const getRecentWeatherReadings = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/weather/current');
      setLocalWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    getRecentWeatherReadings();
  }, []);

  return (
    <div>
      {localWeatherData ? (
        <div>
          {/* Render your weather data here */}
          <pre>{JSON.stringify(localWeatherData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherReadings;