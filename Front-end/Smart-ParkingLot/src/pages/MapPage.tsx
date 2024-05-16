import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Map from '../components/Map';

const MapPage: React.FC = () => {

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar />
            </div>
            <Map />
            <div>
            <Navbar />
            </div>
        </div>
    );
}

export default MapPage;