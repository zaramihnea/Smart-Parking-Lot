import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const AccountBalance = () => {
  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(30);

  const handleToggleInput = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const handleAddAmount = () => {
    if (parseFloat(amount) > 0) {
      setBalance(balance + parseFloat(amount));
      setShowInput(false);
      setAmount(''); // Clear the input field after adding the amount
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-50 w-full p-4 bg-gray-100 dark:bg-gray-900">
        <SearchBar />
      </div>
      <div className="flex flex-col items-center flex-grow p-4 mb-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-purple-500 mb-4" style={{ color: '#796bdd' }}>Account Balance</h2>
          <div className="bg-gray-300 dark:bg-gray-700 px-4 py-3 rounded-md text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between shadow-lg">
            <p className="text-4xl font-bold">${balance}</p>
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
              onClick={handleToggleInput}
            >
              +
            </button>
          </div>
          {showInput && (
            <div className="p-2 rounded-md mt-4" style={{ width: '100%' }}>
              <div className="flex items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-grow py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddAmount}
                  className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          <h2 className="text-3xl font-bold text-purple-500 mb-4 mt-8" style={{ color: '#796bdd' }}>Payment History</h2>
          <div className="p-4 bg-gray-300 dark:bg-gray-700 rounded-md shadow-lg flex-grow">
            <p className="text-gray-900 dark:text-gray-100 font-bold">No registered payments yet..</p>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default AccountBalance;