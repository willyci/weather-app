import React from 'react';

interface SearchBarProps {
  location: string;
  setLocation: (location: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ location, setLocation, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter a city"
        className="p-2 border rounded mr-2"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;