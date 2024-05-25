import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  const handleAccept = () => {
    alert('Accepted and navigating to payment...');
    navigate('/payment');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl mb-4">This is what we found:</h1>
      <div className="border p-4 mb-4 bg-white dark:bg-gray-800 rounded shadow-md">
        <p><strong>Parking Location:</strong> {query}</p>
        <p><strong>Parking Spot:</strong> A12</p>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={handleAccept} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Accept and Pay
        </button>
        <button 
          onClick={handleCancel} 
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
          Cancel
        </button>
      </div>
    </div>
  );
}