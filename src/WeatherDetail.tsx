import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sun, Moon, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
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

const API_KEY = '6db336e9546858e122211e44de591f10';

const WeatherDetail: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUnit = localStorage.getItem('unit');
    if (savedUnit) {
      setUnit(savedUnit as 'metric' | 'imperial');
    }
    if (city) {
      fetchWeather(city);
    }
  }, [city, unit]);

  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <button onClick={() => navigate('/')} className="mb-4 bg-blue-500 text-white p-2 rounded">
          Go Back
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
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
    <div className="container mx-auto p-4">
      <button onClick={() => navigate('/')} className="mb-4 bg-blue-500 text-white p-2 rounded">
        Go Back
      </button>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-2">{weatherData.name}</h2>
        <p className="text-4xl font-bold mb-2">
          {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </p>
        <p className="mb-4">{weatherData.weather[0].description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Sun className="mr-2" />
            Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
          </div>
          <div className="flex items-center">
            <Moon className="mr-2" />
            Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
          </div>
          <div className="flex items-center">
            <Wind className="mr-2" />
            Wind: {weatherData.wind.speed} m/s
          </div>
          <div className="flex items-center">
            <Droplets className="mr-2" />
            Humidity: {weatherData.main.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetail;