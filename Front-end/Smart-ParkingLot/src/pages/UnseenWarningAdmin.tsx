import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

interface Warning {
  id: number;
  user: string;
  description: string;
  proof: string;
}

const UnseenWarningAdmin: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([
    {
      id: 1,
      user: 'User X',
      description: 'User X claims to occupy his parking space',
      proof: 'proof.jpg' // Placeholder for proof image
    }
  ]);

  const navigate = useNavigate();

  const handleSendHelp = (id: number) => {
    // Handle sending help
    alert(`Help sent for warning ${id}`);
    setWarnings(prevWarnings => prevWarnings.filter(warning => warning.id !== id));
  };

  const handleApplyRefund = (id: number) => {
    // Handle applying refund
    alert(`Refund applied for warning ${id}`);
    setWarnings(prevWarnings => prevWarnings.filter(warning => warning.id !== id));
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for destination" />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">Unread</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Back
          </button>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {warnings.map(warning => (
            <div key={warning.id} className="mb-4 bg-gray-700 p-4 rounded-lg shadow-md">
              <h2 className="text-white mb-2">{warning.description}</h2>
              <div className="flex justify-center mb-2">
                <img src={warning.proof} alt="Proof" className="h-24 w-24" />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => handleSendHelp(warning.id)}
                  className="w-full mr-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                  Send help
                </button>
                <button
                  onClick={() => handleApplyRefund(warning.id)}
                  className="w-full ml-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                  Apply refund
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default UnseenWarningAdmin;
