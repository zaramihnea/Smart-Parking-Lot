import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTimePicker from '../components/CustomTimePicker';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const Reserve1: React.FC = () => {
  const [startTime, setStartTime] = useState<string | null>('10:00');
  const [endTime, setEndTime] = useState<string | null>('12:00');
  const navigate = useNavigate();

  const handleReserve = () => {
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    navigate('/home/reserve1/reserve2');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar placeholder="Search for parking spot" />
      </div>
      <div className="flex flex-col items-center flex-grow p-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h2 className="text-xl font-medium mb-4">Reserve Parking</h2>
          <div className="flex justify-between gap-4">
            <CustomTimePicker label="Start Time" value={startTime} onChange={setStartTime} />
            <CustomTimePicker label="End Time" value={endTime} onChange={setEndTime} />
          </div>
          <button
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-4 hover:bg-purple-700 transition duration-300"
            onClick={() => {handleReserve; navigate('/home/reserve1/reserve2')}}
          >
            Reserve Now
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Reserve1;


