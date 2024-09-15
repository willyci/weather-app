import React, { useState, useEffect } from 'react';
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
const DEFAULT_LOCATIONS = ['Berlin', 'London'];

const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [defaultLocationsData, setDefaultLocationsData] = useState<
    Record<string, WeatherData>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  useEffect(() => {
    const savedUnit = localStorage.getItem('unit');
    if (savedUnit) {
      setUnit(savedUnit as 'metric' | 'imperial');
    }
    fetchDefaultLocationsWeather();
    const interval = setInterval(fetchDefaultLocationsWeather, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [unit]);

  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch weather data for', city, err);
      return null;
    }
  };

  const fetchDefaultLocationsWeather = async () => {
    const weatherPromises = DEFAULT_LOCATIONS.map((city) => fetchWeather(city));
    const weatherResults = await Promise.all(weatherPromises);
    const newDefaultLocationsData: Record<string, WeatherData> = {};
    weatherResults.forEach((data, index) => {
      if (data) {
        newDefaultLocationsData[DEFAULT_LOCATIONS[index]] = data;
      }
    });
    setDefaultLocationsData(newDefaultLocationsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      const data = await fetchWeather(location);
      if (data) {
        setWeatherData(data);
        setError(null);
      } else {
        setError('Failed to fetch weather data. Please try again.');
        setWeatherData(null);
      }
    }
  };

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
    fetchDefaultLocationsWeather();
    if (weatherData) {
      fetchWeather(weatherData.name).then((data) => {
        if (data) setWeatherData(data);
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Forecast</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Get Weather
          </button>
        </div>
      </form>

      <div className="mb-4">
        <button
          onClick={() => handleUnitChange('metric')}
          className={`mr-2 p-2 rounded ${
            unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          °C
        </button>
        <button
          onClick={() => handleUnitChange('imperial')}
          className={`p-2 rounded ${
            unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          °F
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {weatherData && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-2">{weatherData.name}</h2>
          <p className="text-4xl font-bold mb-2">
            {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p className="mb-4">{weatherData.weather[0].description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Sun className="mr-2" />
              Sunrise:{' '}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </div>
            <div className="flex items-center">
              <Moon className="mr-2" />
              Sunset:{' '}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
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
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Default Locations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_LOCATIONS.map((city) => (
          <button
            key={city}
            onClick={() =>
              fetchWeather(city).then((data) => {
                if (data) setWeatherData(data);
              })
            }
            className="w-full bg-gray-200 p-2 rounded flex justify-between items-center"
          >
            <span>{city} </span>
            {defaultLocationsData[city] && (
              <span className="font-bold">
                {Math.round(defaultLocationsData[city].main.temp)}°
                {unit === 'metric' ? 'C' : 'F'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
