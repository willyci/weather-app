import React from 'react';

interface UnitToggleProps {
  unit: 'metric' | 'imperial';
  handleUnitChange: (newUnit: 'metric' | 'imperial') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, handleUnitChange }) => {
  return (
    <div className="mb-4">
      <button
        onClick={() => handleUnitChange('metric')}
        className={`button-small mr-2 p-2 rounded ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        °C
      </button>
      <button
        onClick={() => handleUnitChange('imperial')}
        className={`button-small p-2 rounded ${unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;