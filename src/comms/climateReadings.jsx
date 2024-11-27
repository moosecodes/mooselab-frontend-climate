import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClimateMonitor = () => {
  // Define state variables for climate data and error message
  const [climateData, setClimateData] = useState(null);
  const [error, setError] = useState(null);

  // useEffect to fetch the climate data on component mount
  useEffect(() => {
    const getRecentClimateReadings = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/climate/current');
        setClimateData(response.data);  // Update state with the fetched data
      } catch (err) {
        setError(err.message);  // Handle errors by updating the error state
      }
    };

    getRecentClimateReadings();  // Call the function on mount
  }, []);  // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1>Climate Monitor</h1>
      {error && <p>Error: {error}</p>}  {/* Display error if there is one */}
      {climateData ? (
        <div>
          <h2>Recent Climate Data</h2>
          {/* Render climate data here */}
          <pre>{JSON.stringify(climateData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading climate data...</p>
      )}
    </div>
  );
};

export default ClimateMonitor;
