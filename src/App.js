import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import { chartData, chartOpts } from './chart.config'

import Headline from './components/Headline.jsx';
import RoomConditions from './components/RoomConditions.jsx';
import WeatherConditions from './components/WeatherConditions.jsx';
import LatestReadings from './components/LatestReadings.jsx';
// import ClimateMonitor from './comms/climateReadings.jsx';
// import WeatherReadings from './comms/weatherReadings.jsx';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, Filler, zoomPlugin);

const App = () => {
  const chartRef = useRef(null);
  const [climateData, setClimateData] = useState([]);
  const [localWeatherData, setLocalWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const getRecentClimateReadings = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_DHT11_BASE_URL + '/recent');
      setClimateData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const getRecentWeatherReadings = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_WEATHER_BASE_URL + '/recent');
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
    getRecentClimateReadings();
    const climateIntervalId = setInterval(getRecentClimateReadings, process.env.REACT_APP_UPDATE_INTERVAL);

    getRecentWeatherReadings();
    const weatherIntervalId = setInterval(getRecentWeatherReadings, process.env.REACT_APP_UPDATE_INTERVAL);

    return () => {
      // On unmount, clear the intervals
      clearInterval(climateIntervalId);
      clearInterval(weatherIntervalId);
    }
  }, []);

  return (
    <div>
      {climateData.length > 0 ? (
        <>
          <Headline error={error} />

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <RoomConditions climateData={climateData} />  
            <WeatherConditions localWeatherData={localWeatherData} />
          </div>

          {localWeatherData && 
            <Line 
              ref={chartRef} 
              data={chartData(climateData, localWeatherData)} 
              options={chartOpts} />}

          { localWeatherData && <center style={{ marginTop: '10px' }}>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
            <button onClick={handleResetZoom}>Reset Zoom</button>
            <button onClick={handlePanLeft}>Pan Left</button>
            <button onClick={handlePanRight}>Pan Right</button>
          </center>}

          <LatestReadings climateData={climateData} />
          
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
