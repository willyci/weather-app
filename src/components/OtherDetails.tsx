import React from 'react';

interface OtherDetailsProps {
  windSpeed: number;
  humidity: number;
  sunrise: number;
  sunset: number;
}

const OtherDetails: React.FC<OtherDetailsProps> = ({ windSpeed, humidity, sunrise, sunset }) => {
  return (
    <div id="other-details" className="grid grid-cols-2 gap-4 w-50-10">
    <div className="flexh">
      <div className="flex items-center flexv w-25 bold-div-1">
        <div>Sunrise</div>
        <div className="medium-text">{new Date(sunrise * 1000).toLocaleTimeString()}</div>
      </div>
      <div className="flex items-center flexv w-25 bold-div-2">
        <div>Sunset</div>
        <div className="medium-text">{new Date(sunset * 1000).toLocaleTimeString()}</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 flexh">
      <div className="flex items-center flexv w-25 bold-div-3">
        <div>Wind</div>
        <div className="medium-text">{windSpeed} m/s</div>
      </div>
      <div className="flex items-center flexv w-25">
        <div>Humidity</div>
        <div className="medium-text">{humidity}%</div>
      </div>
    </div>
  </div>
  );
};

export default OtherDetails;