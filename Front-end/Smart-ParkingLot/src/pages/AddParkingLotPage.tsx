import React from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Map from '../components/Map';

const AddParkingLotPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
            <div className="sticky top-0 z-50 w-full flex justify-center bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-4xl px-4">
                    <SearchBar placeholder={''} />
                </div>
            </div>
            <div className="flex justify-center items-center flex-grow mt-4 mb-4 px-4">
                <div className="w-full max-w-4xl h-96 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <Map />
                </div>
            </div>
            <div className="sticky bottom-0 z-50 w-full">
                <Navbar />
            </div>
        </div>
    );
}

export default AddParkingLotPage;
