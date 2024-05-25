import React from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Map from '../components/Map';

const MapPage: React.FC = () => {
    return (
        <div className="relative h-screen w-full">
            <div className="fixed top-0 left-0 w-full z-50">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="absolute h-screen w-full z-0">
                <Map />
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <Navbar />
            </div>
        </div>
    );
}

export default MapPage;
