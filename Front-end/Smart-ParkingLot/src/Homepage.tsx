import React from 'react'
import Map from './components/Map'
import SearchBar from './components/SearchBar'

const Homepage: React.FC = () => {
  return (
    <div>
      <SearchBar />
      <Map />
    </div>
  );
};

export default Homepage;
