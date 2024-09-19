import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  city: string;
  temperature: number | null;
  unit: 'metric' | 'imperial';
  onClick: () => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ city, temperature, unit, onClick }) => {
  return (
    <button onClick={onClick} className="w-full bg-gray-200 p-2 rounded flex justify-between items-center">
      <span className="flex items-center">
        <MapPin className="mr-2" size={18} /> {city} </span>
      {temperature !== null && (
        <span className="font-bold">
          {Math.round(temperature)}°{unit === 'metric' ? 'C' : 'F'}
        </span>
      )}
    </button>
  );
};

export default LocationButton;