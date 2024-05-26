import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const EditParkingLotPage: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder data, should be replaced with actual data fetch
  const [address, setAddress] = useState('123 Parking Lot St.');
  const [spaces, setSpaces] = useState<{ id: number; name: string }[]>([
    { id: 1, name: 'A1' },
    { id: 2, name: 'A2' },
  ]);

  const handleDelete = () => {
    // Implement delete logic
    alert('Parking lot deleted!');
    navigate('/profile/admin-parking-panel');
  };

  const handleSpaceNameChange = (id: number, name: string) => {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => (space.id === id ? { ...space, name } : space))
    );
  };

  const handleAddSpace = () => {
    const newId = spaces.length > 0 ? spaces[spaces.length - 1].id + 1 : 1;
    setSpaces([...spaces, { id: newId, name: `A${newId}` }]);
  };

  const handleRemoveSpace = (id: number) => {
    setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
      <div className="sticky top-0 z-50 w-full flex justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-4xl px-4">
          <SearchBar placeholder="Search for parking spot" />
        </div>
      </div>
      <div className="flex flex-col items-center flex-grow mt-4 mb-4 px-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Parking Lot</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Parking Spaces
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Parking spaces names should be easily recognisable (e.g. A1, A2, etc.) and should be printed on the ground.
                </p>
              {spaces.map((space) => (
                <div key={space.id} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={space.name}
                    onChange={(e) => handleSpaceNameChange(space.id, e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg mr-2"
                  />
                  <button
                    onClick={() => handleRemoveSpace(space.id)}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddSpace}
                className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-2"
              >
                Add Parking Space
              </button>
            </div>
            <button
              className="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default EditParkingLotPage;
