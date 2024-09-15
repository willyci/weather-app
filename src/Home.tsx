import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
}

const API_KEY = '6db336e9546858e122211e44de591f10';
const DEFAULT_LOCATIONS = ['Berlin', 'London'];

const Home: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [defaultLocationsData, setDefaultLocationsData] = useState<Record<string, WeatherData>>({});
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const navigate = useNavigate();

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
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch weather data for', city, err);
      return null;
    }
  };

  const fetchDefaultLocationsWeather = async () => {
    const weatherPromises = DEFAULT_LOCATIONS.map(city => fetchWeather(city));
    const weatherResults = await Promise.all(weatherPromises);
    const newDefaultLocationsData: Record<string, WeatherData> = {};
    weatherResults.forEach((data, index) => {
      if (data) {
        newDefaultLocationsData[DEFAULT_LOCATIONS[index]] = data;
      }
    });
    setDefaultLocationsData(newDefaultLocationsData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      navigate(`/weather/${location}`);
    }
  };

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
    fetchDefaultLocationsWeather();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Forecast</h1>
      

        {/*
      <div className="mb-4">
        <button 
          onClick={() => handleUnitChange('metric')} 
          className={`mr-2 p-2 rounded ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          °C
        </button>
        <button 
          onClick={() => handleUnitChange('imperial')} 
          className={`p-2 rounded ${unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          °F
        </button>
      </div>
      */}

      <h2 className="text-2xl font-bold mt-8 mb-4">Default Locations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_LOCATIONS.map((city) => (
          <button 
            key={city} 
            onClick={() => navigate(`/weather/${city}`)} 
            className="w-full bg-gray-200 p-2 rounded flex justify-between items-center"
          >
            <span>{city} </span>
            {defaultLocationsData[city] && (
              <span className="font-bold"> 
                {Math.round(defaultLocationsData[city].main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;