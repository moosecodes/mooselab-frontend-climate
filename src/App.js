import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Weather Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            Celsius: {item.celsius}, Fahrenheit: {item.farenheit}, Humidity: {item.humidity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
