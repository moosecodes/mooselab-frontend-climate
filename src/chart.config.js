const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const chartOpts = {
  layout: {
    padding: 50
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy', // Pan in both x and y directions
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'xy', // Zoom in both x and y directions
      },
    },
  },
  scales: {
    x: {
      type: 'time', // Set x-axis type to time
      time: {
        unit: 'hour', // Change this to 'hour', 'day', etc., as needed
        tooltipFormat: 'HH:mm', // Format for tooltips
        displayFormats: {
          hour: 'MMM d, HH:mm ', // Display format for the x-axis labels
        },
      },
      title: {
        display: true,
        text: 'Time',
      },
    },
    y: {
      max: 100,
      min: 0,
      title: {
        display: true,
        text: 'Temperature',
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value) {
          return value + '°';
        }
      }
    },
  },
};

const dateAndTime = (created_at) => {
  return <small>
    {new Date(created_at).toLocaleString()}
  </small>
}

const climateStats = (f, c, h) => {
  return <div>
    <b>{f} °F</b>
    {/* <small> | {c} °C</small> */}
    <br />
    <small>Humidity: {h} %</small>
  </div>
}

// Prepare data for the chart
const chartData = (climateData, recentEntries) => {
  return {
    labels: climateData.map(({ created_at }) => created_at),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: climateData.map(({ created_at, farenheit }) => ({
          x: new Date(created_at),
          y: farenheit,
        })),
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      // {
      //   label: 'Temperature (°C)',
      //   data: climateData.map(({ created_at, celsius }) => ({
      //     x: new Date(created_at),
      //     y: celsius,
      //   })),
      //   borderColor: 'rgba(255, 99, 132, 1)',
      // },
      {
        label: 'Outside Temp (°F)',
        data: recentEntries.map(({ created_at, farenheit }) => ({
          x: new Date(created_at),
          y: farenheit,
        })),
        borderColor: 'rgba(255, 100, 255, 1)',
      },
    ],
  }
};

export { apiBaseUrl, chartOpts, dateAndTime, climateStats, chartData };