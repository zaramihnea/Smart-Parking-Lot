import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import useEmail from '../hooks/useEmail'
import { User } from '../types/User';
import Cookies from 'js-cookie';

const AccountBalance = () => {
  const [showInput, setShowInput] = useState(false);
  const baseURL = process.env.API_BASE_URL;
  const [baseUrlString]= useState<string>(baseURL || 'http://localhost:8081');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [balance, setBalance] = useState<User['balance']>(0);
  const { getEmail } = useEmail();  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionErrorMessage, setTransactionErrorMessage] = useState('');
  const [addErrorMessage, setAddErrorMessage] = useState('');

  // Fetch email
  useEffect(() => {
    getEmail(baseUrlString).then((name) => {
      setEmail(name);
    });
  }, [baseUrlString, getEmail]); // Dependencies

  useEffect(() => {
    const fetchUserBalance = async () => {
      if(email !== 'user@example.com'){
        try {
          const response = await fetch(`${baseUrlString}/user/get-stripe-balance?email=${email}`);

          if (!response.ok) {
            const textResponse = await response.text();
            throw new Error(textResponse);
          }

          const data: User['balance'] = await response.json();
          setBalance(data);

        } catch (error) {
          setBalance(0);
          console.error('Error fetching stripe balance from user:', error);
        }
      };
    }
    fetchUserBalance();
  }, [email]);

  const handleToggleInput = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${baseUrlString}/user/get-transactions-history?email=${email}`);

      if (!response.ok) {
        const textResponse = await response.text();
        if(textResponse.includes('No customer found'))setTransactionErrorMessage('No registered payments yet...');
        else setTransactionErrorMessage('Error retrieving customer transactions. Try again later.');
        throw new Error(textResponse);
      }

      const fetchedTransactions = await response.json();
      setTransactions(fetchedTransactions);
      console.log(transactions);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (email === 'user@example.com') {
      setTransactionErrorMessage('Your are not logged in yet.');
    }else {
      fetchTransactions();
    }
  }, [email]); // Fetch transactions when email changes


  const handleAddAmount = async() => {
    if(email === 'user@example.com'){
      setAddErrorMessage('You are not logged in yet.');
    } else {

      const url = `${baseUrlString}/user/create-stripe-account`; 
      const requestBody = {
        email: email
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody), // Convert object to JSON string
        });
  
        if (!response.ok) {
          const textResponse = await response.text();
          throw new Error(textResponse);
        }
  
        //const textResponse = await response.json();
        //console.log(textResponse);

        window.location.href = `${baseUrlString}/checkout?email=${email}&amount=${amount}`;

      } catch (error) {
        console.error('Error fetching transactions:', error);
        setAddErrorMessage('Internal server error. Try again later.');
      }


      if (parseFloat(amount) > 0) {
        console.log('Adding amount:', amount); 
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-50 w-full p-4 bg-gray-100 dark:bg-gray-900">
        <SearchBar placeholder="Search for parking spot" />
      </div>
      <div className="flex flex-col items-center flex-grow p-4 mb-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-purple-500 mb-4" style={{ color: '#796bdd' }}>Account Balance</h2>
          <div className="bg-gray-300 dark:bg-gray-700 px-4 py-3 rounded-md text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between shadow-lg">
            <p className="text-4xl font-bold">RON {balance}</p>
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
              onClick={handleToggleInput}
            >
              +
            </button>
          </div>
          {showInput && (
            <div className="p-2 rounded-md mt-4" style={{ width: '100%' }}>
              <div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-grow py-2 px-4 bg-gray-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddAmount}
                    className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
                  >
                    Add
                  </button>
                </div>
                <p className='text-red-500 text-center mt-4'>{addErrorMessage}</p>
              </div>
            </div>
          )}
          <h2 className="text-3xl font-bold text-purple-500 mb-4 mt-8" style={{ color: '#796bdd' }}>Payment History</h2>
          <div className="p-4 bg-gray-300 dark:bg-gray-700 rounded-md shadow-lg flex-grow">
              {transactions.length === 0 ? (
              <p className="text-gray-900 dark:text-gray-100 font-bold">{transactionErrorMessage}</p>
              ) : (
                // Displaying fetched transactions here (iterate through transactions array)
                <div>
                  {/* Looping through transactions and display them */}
                  {transactions.map((transaction) => (
                    <div key={transaction.id}> {/* Using an unique identifier for each transaction */}
                      {/* Extracting and displaying relevant information from each transaction object */}
                      <p>Date: {transaction.created}</p>
                      <p>Amount: {transaction.amount} {transaction.currency}</p>
                      <p>Description: {transaction.description}</p>
                      <p>Status: {transaction.status}</p>
                      
                      <hr className="mt-4 mb-4 border-gray-200"/>
                      {/* ... other relevant details */}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default AccountBalance;
