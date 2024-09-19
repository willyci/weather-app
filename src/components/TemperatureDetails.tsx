import React from 'react';

interface TemperatureDetailsProps {
  temperature: number;
  tempMin: number;
  tempMax: number;
  unit: 'metric' | 'imperial';
  description: string;
}

const TemperatureDetails: React.FC<TemperatureDetailsProps> = ({ temperature, tempMin, tempMax, unit, description }) => {
  return (
    <div className="w-50 flexv">
      <p className="mb-4 small-text">{description}</p>
      <p className="big-text font-bold mb-2">
        {Math.round(temperature)}°{unit === 'metric' ? 'C' : 'F'}
      </p>
      <div className="flexh">
        <p className="text-4xl font-bold mb-2 small-text">
          H: {Math.round(tempMax)}°{unit === 'metric' ? 'C' : 'F'}&nbsp;
        </p>
        <p className="text-4xl font-bold mb-2 small-text">
          L: {Math.round(tempMin)}°{unit === 'metric' ? 'C' : 'F'}
        </p>
      </div>
    </div>
  );
};

export default TemperatureDetails;