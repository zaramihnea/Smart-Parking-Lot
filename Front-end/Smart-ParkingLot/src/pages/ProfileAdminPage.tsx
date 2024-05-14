import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileAdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-200 h-screen p-4">
      <div className="bg-white shadow rounded-lg w-full max-w-md">
        <div className="flex justify-center mt-4">
          {/* Profile Image Section */}
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <button className="bg-gray-100 w-full py-2 rounded-md text-center hover:bg-gray-200 transition duration-150"
              onClick={() => navigate('/details')}>Details</button>
            <button className="bg-gray-100 w-full py-2 rounded-md text-center hover:bg-gray-200 transition duration-150"
              onClick={() => navigate('/questions')}>Questions</button>
            <button className="bg-gray-100 w-full py-2 rounded-md text-center hover:bg-gray-200 transition duration-150"
              onClick={() => navigate('/users')}>See all users</button>
            <button className="bg-gray-100 w-full py-2 rounded-md text-center hover:bg-gray-200 transition duration-150"
              onClick={() => navigate('/parkingspots')}>See all parking spots/spaces</button>
            <button className="bg-gray-100 w-full py-2 rounded-md text-center hover:bg-gray-200 transition duration-150"
              onClick={() => navigate('/warnings')}>Unseen warnings</button>
          </div>
          <button className="bg-purple-500 text-white w-full py-2 rounded-md mt-4 hover:bg-purple-600 transition duration-150"
            onClick={() => navigate('/logout')}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdminPage;
