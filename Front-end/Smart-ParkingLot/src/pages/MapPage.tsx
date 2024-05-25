import React from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Map from '../components/Map';

const MapPage: React.FC = () => {
    return (
        <div className="relative h-screen w-full">
            <div className="fixed top-0 left-0 w-full z-50">
                <SearchBar />
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <Navbar />
            </div>
            <div className="absolute top-14 bottom-20 left-0 w-full z-0">
                <Map />
            </div>
        </div>
    );
}

export default MapPage;
