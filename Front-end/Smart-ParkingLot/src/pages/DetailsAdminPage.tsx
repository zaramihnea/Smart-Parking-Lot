import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

const DetailsAdminPage: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleConfirm = () => {
    const userDetails = { name, address, country, phoneNumber, email };
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    alert('Details saved successfully!');
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for parking spot" />
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 p-4 rounded-full">
              <svg width="50" height="50" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M26.1658 92.184C34.4177 99.4924 45.2713 103.929 57.1611 103.929C69.0509 103.929 79.9044 99.4924 88.1563 92.184C86.6354 86.7152 75.7092 83.1434 57.1611 83.1434C38.6129 83.1434 27.6867 86.7152 26.1658 92.184ZM18.7099 83.7911C24.5582 76.0661 38.301 72.7505 57.1611 72.7505C76.0211 72.7505 89.7639 76.0661 95.6123 83.7911C100.856 76.2337 103.929 67.0563 103.929 57.1611C103.929 31.3317 82.9904 10.3929 57.1611 10.3929C31.3317 10.3929 10.3929 31.3317 10.3929 57.1611C10.3929 67.0563 13.466 76.2337 18.7099 83.7911ZM57.1611 114.322C25.5919 114.322 0 88.7303 0 57.1611C0 25.5919 25.5919 0 57.1611 0C88.7303 0 114.322 25.5919 114.322 57.1611C114.322 88.7303 88.7303 114.322 57.1611 114.322ZM36.3752 46.7682C36.3752 35.106 44.581 25.9823 57.1611 25.9823C69.7063 25.9823 77.9469 35.9677 77.9469 47.8074C77.9469 64.8498 68.6873 72.7505 57.1611 72.7505C45.5255 72.7505 36.3752 64.5784 36.3752 46.7682ZM46.7682 46.7682C46.7682 58.5603 51.02 62.3575 57.1611 62.3575C63.281 62.3575 67.554 58.7117 67.554 47.8074C67.554 41.314 63.4782 36.3752 57.1611 36.3752C50.581 36.3752 46.7682 40.6146 46.7682 46.7682Z" fill="#7167EE"/>
              </svg>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Back
            </button>
          </div>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <button
              onClick={handleConfirm}
              className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default DetailsAdminPage;
