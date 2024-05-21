// src/pages/Homepage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const savedCars = [
    { brand: 'Volkswagen', model: 'Polo', plate: 'IS16LFK' },
    { brand: 'Honda', model: 'Civic', plate: 'B16RTJ' },
  ];

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
        <SearchBar />
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-semibold">Welcome, username!</h1>
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
      <Navbar />
    </div>
  );
};

export default Homepage;

