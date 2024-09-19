import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import LocationButton from '../components/LocationButton';
import UnitToggle from '../components/UnitToggle';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
}

const API_KEY = '6db336e9546858e122211e44de591f10';
const DEFAULT_LOCATIONS = ['Berlin', 'London'];
const FALLBACK_LOCATION = 'Boston';

const Home: React.FC = () => {
  // State variables for location, weather data, unit, and current location
  const [location, setLocation] = useState<string>('');
  const [defaultLocationsData, setDefaultLocationsData] = useState<Record<string, WeatherData>>({});
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved unit from localStorage
    const savedUnit = localStorage.getItem('unit');
    if (savedUnit) {
      setUnit(savedUnit as 'metric' | 'imperial');
    }
    getCurrentLocation(); // Get the user's current location
  }, [unit]);

  useEffect(() => {
    // Fetch weather data for default locations when currentLocation or unit changes
    fetchDefaultLocationsWeather();
    const interval = setInterval(fetchDefaultLocationsWeather, 600000); // Update every 10 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentLocation, unit]);

  // Function to fetch weather data for a specific city
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
        return JSON.parse(storedWeatherData);
      }
    }

    // Fetch new data if no valid cached data
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      const data = await response.json();

      // Save the fetched weather data and timestamp to localStorage
      localStorage.setItem(`weatherData_${city}`, JSON.stringify(data));
      localStorage.setItem(`weatherDataTimestamp_${city}`, JSON.stringify(Date.now()));

      return data;
    } catch (err) {
      console.error('Failed to fetch weather data for', city, err);
      return null;
    }
  };

  // Function to fetch weather data for default locations and the current location
  const fetchDefaultLocationsWeather = async () => {
    const locationsToFetch = [...DEFAULT_LOCATIONS, currentLocation].filter(Boolean);
    const weatherPromises = locationsToFetch.map(city => fetchWeather(city as string));
    const weatherResults = await Promise.all(weatherPromises);
    const newDefaultLocationsData: Record<string, WeatherData> = {};
    weatherResults.forEach((data, index) => {
      if (data) {
        newDefaultLocationsData[locationsToFetch[index] as string] = data;
      }
    });
    setDefaultLocationsData(newDefaultLocationsData); // Update state with new weather data
  };

  // Handle form submission to navigate to the weather details page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      navigate(`/weather/${location}`);
    }
  };

  // Change the unit of measurement for temperature
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
    fetchDefaultLocationsWeather(); // Fetch weather data with the new unit
  };

  // Set a fallback location if the current location cannot be determined
  const setFallbackLocation = async () => {
    setCurrentLocation(FALLBACK_LOCATION);
    const fallbackData = await fetchWeather(FALLBACK_LOCATION);
    if (fallbackData) {
      setDefaultLocationsData(prev => ({ ...prev, [FALLBACK_LOCATION]: fallbackData }));
    }
  };

  // Get the user's current geographical location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
            );
            if (!response.ok) {
              throw new Error('Weather data not found');
            }
            const data = await response.json();
            setCurrentLocation(data.name);
            setDefaultLocationsData(prev => ({ ...prev, [data.name]: data }));
          } catch (err) {
            console.error('Failed to fetch current location weather', err);
            setFallbackLocation(); // Use fallback if fetching fails
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setFallbackLocation(); // Use fallback if geolocation fails
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setFallbackLocation(); // Use fallback if geolocation is not supported
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <SearchBar location={location} setLocation={setLocation} handleSubmit={handleSubmit} />
      <UnitToggle unit={unit} handleUnitChange={handleUnitChange} />
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentLocation && (
          <LocationButton
            city={currentLocation}
            temperature={defaultLocationsData[currentLocation]?.main.temp}
            unit={unit}
            onClick={() => navigate(`/weather/${currentLocation}`)}
          />
        )}
        {DEFAULT_LOCATIONS.map((city) => (
          <LocationButton
            key={city}
            city={city}
            temperature={defaultLocationsData[city]?.main.temp}
            unit={unit}
            onClick={() => navigate(`/weather/${city}`)}
          />
        ))}
      </div>

    </div>
  );
};

export default Home;
