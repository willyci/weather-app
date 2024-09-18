import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const API_KEY = "6db336e9546858e122211e44de591f10";

const WeatherDetail: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchWeather = async (city: string) => {
      const storedWeatherData = localStorage.getItem(`weatherData_${city}`);
      const storedTimestamp = localStorage.getItem(`weatherDataTimestamp_${city}`);

      // Check if we have stored data and if it's less than 60 minutes old
      if (storedWeatherData && storedTimestamp) {
        const timestamp = JSON.parse(storedTimestamp);
        const currentTime = Date.now();

        // Check if the data is less than 60 minutes old (3600000 milliseconds)
        if (currentTime - timestamp < 3600000) {
          console.log('Using cached weather data');
          setWeatherData(JSON.parse(storedWeatherData));
          return;
        }
      }

      // If no valid cached data, fetch new data
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

        setWeatherData(data);
      } catch (err) {
        console.error('Failed to fetch weather data for', city, err);
        setError("Failed to fetch weather data. Please try again.");
        setWeatherData(null);
      }
    };

    if (city) {
      fetchWeather(city);
    }
  }, [city]);

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

  if (!weatherData) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

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
        <div className="w-50 flexv">
          <p className="mb-4 small-text">{weatherData.weather[0].description}</p>
          <p className="big-text font-bold mb-2">
            {Math.round(weatherData.main.temp)}°{unit === "metric" ? "C" : "F"}
          </p>
          <div className="flexh">
            <p className="text-4xl font-bold mb-2 small-text">
              H: {Math.round(weatherData.main.temp_min)}°
              {unit === "metric" ? "C" : "F"}&nbsp;
            </p>
            <p className="text-4xl font-bold mb-2 small-text">
               L: {Math.round(weatherData.main.temp_max)}°
              {unit === "metric" ? "C" : "F"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-50-10">
          <div className="flexh">
            <div className="flex items-center  flexv w-25 bold-div-1">
              <div>Sunrise</div>
              <div className="medium-text">{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center flexv w-25 bold-div-2">
            <div>Sunset</div>
            <div className="medium-text">{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 flexh">
            <div className="flex items-center flexv w-25 bold-div-3">
            <div>Wind</div>
              <div className="medium-text">{weatherData.wind.speed} m/s</div>
            </div>
            <div className="flex items-center flexv w-25">
              <div>Humidity</div>
             <div className="medium-text">{weatherData.main.humidity}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetail;
