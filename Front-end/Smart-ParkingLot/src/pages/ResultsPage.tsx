import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  const handleAccept = () => {
    alert('Accepted and navigating to payment...');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-4">This is what we found:</h1>
      <div className="border p-4 mb-4 bg-white rounded shadow">
        <p><strong>Parking Location:</strong> {query}</p>
        <p><strong>Parking Spot:</strong> A12</p>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={handleAccept} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Accept and Pay
        </button>
        <button 
          onClick={handleCancel} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
