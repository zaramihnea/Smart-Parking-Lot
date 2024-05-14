import React from 'react'
import SearchBar from './components/SearchBar'

const Homepage: React.FC = () => {
  const savedCars = [
    { brand: 'Volkswagen', model: 'Polo', plate: 'IS16LFK' },
    { brand: 'Honda', model: 'Civic', plate: 'B16RTJ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar />
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-semibold">Welcome, username!</h1>
          <button className="bg-purple-600 text-white px-2 py-2 text-md rounded-lg shadow-md hover:bg-purple-700 transition duration-300 whitespace-nowrap">
            Reserve Parking Spot
          </button>
        </div>
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
    </div>
  );
};

export default Homepage;