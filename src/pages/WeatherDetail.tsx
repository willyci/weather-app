import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TemperatureDetails from '../components/TemperatureDetails';
import OtherDetails from '../components/OtherDetails';

// Define the structure of the weather data we expect from the API
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

// API key for OpenWeatherMap
//const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_KEY = '6db336e9546858e122211e44de591f10';

const WeatherDetail: React.FC = () => {
  // State variables for weather data and error handling
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit] = useState<"metric" | "imperial">("metric"); // Default unit for temperature
  const { city } = useParams<{ city: string }>(); // Get the city parameter from the URL
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Function to fetch weather data for the specified city
    const fetchWeather = async (city: string) => {
      const storedWeatherData = localStorage.getItem(`weatherData_${city}`);
      const storedTimestamp = localStorage.getItem(`weatherDataTimestamp_${city}`);

      // Check if we have stored data and if it's less than 60 minutes old
      if (storedWeatherData && storedTimestamp) {
        const timestamp = JSON.parse(storedTimestamp);
        const currentTime = Date.now();

        // Use cached data if it's less than 60 minutes old
        if (currentTime - timestamp < 3600000) {
          console.log('Using cached weather data');
          setWeatherData(JSON.parse(storedWeatherData));
          return;
        }
      }

      // If no valid cached data, fetch new data from the API
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error('Weather data not found');
        }
        const data = await response.json();

        // Save the weather data and timestamp to localStorage
        localStorage.setItem(`weatherData_${city}`, JSON.stringify(data));
        localStorage.setItem(`weatherDataTimestamp_${city}`, JSON.stringify(Date.now()));

        setWeatherData(data); // Update state with fetched data
      } catch (err) {
        console.error('Failed to fetch weather data for', city, err);
        setError("Failed to fetch weather data for " + city + ". Please try again.");
        setWeatherData(null); // Reset weather data on error
      }
    };

    // Fetch weather data if a city is provided
    if (city) {
      fetchWeather(city);
    }
  }, [city]); // Dependency array to re-run effect when city changes

  // Render error message if there's an error
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={() => navigate("/")}
          className="button-small mb-4 bg-blue-500 text-white p-2 rounded"
        >
          <ArrowLeft size={24} /> Try Again
        </button>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Render loading state if weather data is not yet available
  if (!weatherData) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // Render the weather details once data is available
  return (
    <div className="container p-4 w-full max-w-xs md:max-w-4xl">
      <div className="flex flex-row items-center justify-between mb-4 flexh">
        <button
          onClick={() => navigate("/")}
          className="button-small mb-4 bg-blue-500 text-white p-2 rounded"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-xl flex-grow text-center">{weatherData.name}</h2>
        <div className="w-4"></div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flexhv">      
      <TemperatureDetails
        temperature={weatherData.main.temp}
        tempMin={weatherData.main.temp_min}
        tempMax={weatherData.main.temp_max}
        unit={unit}
        description={weatherData.weather[0].description}
      />
      <OtherDetails
        windSpeed={weatherData.wind.speed}
        humidity={weatherData.main.humidity}
        sunrise={weatherData.sys.sunrise}
        sunset={weatherData.sys.sunset}
      />
    </div>
    </div>
  );
};

export default WeatherDetail;
