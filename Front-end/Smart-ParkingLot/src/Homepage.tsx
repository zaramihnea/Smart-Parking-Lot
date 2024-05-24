// src/pages/Homepage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';
import Map from './components/Map';
import useUsername from "./hooks/useUsername"
import useSavedCars from "./hooks/useSavedCars"

import { Car } from './types/Car';

const Homepage: React.FC = () => {
  const baseUrl = process.env.API_BASE_URL;
  const navigate = useNavigate();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [username, setUsername] = useState('username');
  const [savedCars, setSavedCars] = useState<Car[]>([]);

  // Set the username on the "Welcome, {username} greet message"
  useUsername(baseUrl || "", setUsername);

  useSavedCars(baseUrl || "", setSavedCars);



  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };




  const reservations = [
    {
      googleSearch: 'Parcare Palas Mall',
      address: 'Strada Palas, Iași, Romania',
      spot: '2A',
      startTime: '2024-05-21T09:00',
      endTime: '2024-05-21T11:00',
      plate: 'IS16LFK',
    },
    {
      googleSearch: 'Parcare Iulius Mall',
      address: 'Iași 700259, Romania',
      spot: '3G',
      startTime: '2024-05-21T14:00',
      endTime: '2024-05-21T16:00',
      plate: 'B16RTJ',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar placeholder="Search for parking spot" />
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-semibold">Welcome, {username}!</h1>
          <button 
            onClick={() => navigate('/home/reserve1')}
            className="bg-purple-600 text-white px-2 py-2 text-md rounded-lg shadow-md hover:bg-purple-700 transition duration-300 whitespace-nowrap">
            Reserve Parking Spot
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-medium mb-4">Reservations</h2>
        {reservations.map((reservation, index) => (
          <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
            <div className="flex-1 mb-2 md:mb-0">
              <p className="font-semibold">Address: {reservation.address}</p>
              <p className="text-sm">Spot: {reservation.spot}</p>
              <p className="text-sm">Start Time: {new Date(reservation.startTime).toLocaleString()}</p>
              <p className="text-sm">End Time: {new Date(reservation.endTime).toLocaleString()}</p>
              <p className="text-sm">License Plate: {reservation.plate}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.googleSearch)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Navigate to Parking
            </a>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center flex-grow mt-4 mb-4 px-4">
        <button
          onClick={toggleMapVisibility}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 mb-4"
        >
          {isMapVisible ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
      {isMapVisible && (
        <div className="flex justify-center items-center flex-grow mt-4 mb-4 px-4">
          <div className="w-full max-w-4xl h-96 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden z-0 space-y">
            <Map />
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Saved Cars</h2>
        <div>
          {savedCars.map((car, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
              <div>
                <p className="font-semibold">{car.brand} {car.model}</p>
                <p className="text-sm">{car.plate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 z-50">
        <Navbar />
      </div>
    </div>
  );
};

export default Homepage;
