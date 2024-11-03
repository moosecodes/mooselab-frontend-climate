const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const updateInterval = process.env.REACT_APP_UPDATE_INTERVAL

const chartOpts = {
  layout: {
    padding: 30
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
      title: {
        display: true,
        text: 'Temperature',
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value) {
          return value + '°';
        }
      },
      suggestedMin: 0,
      suggestedMax: 75
    },
  },
};

const dateAndTime = (created_at) => {
  return <small>
    {new Date(created_at).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })} @ {new Date(created_at).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}
  </small>
}

const climateStats = (f, c, h) => {
  return <div>
    <b>{f} °F</b>
    <small> | {c} °C</small><br />
    <small>Humidity: {h} %</small>
  </div>
}

// Prepare data for the chart
const chartData = (weatherData) => {
  return {
    labels: weatherData.map(({ created_at }) => created_at), // Assuming you have a created_at field
    datasets: [
      {
        label: 'Temperature (°F)',
        data: weatherData.map(({ created_at, farenheit }) => ({
          x: new Date(created_at), // Convert created_at to Date object
          y: farenheit,
        })),
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Temperature (°C)',
        data: weatherData.map(({ created_at, celsius }) => ({
          x: new Date(created_at), // Convert created_at to Date object
          y: celsius,
        })),
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  }
};

export { apiBaseUrl, updateInterval, chartOpts, dateAndTime, climateStats, chartData };