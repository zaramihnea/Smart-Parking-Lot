import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const ProfileAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuestionsClick = () => {
    window.open('https://my.livechatinc.com/chats', '_blank');
  };

  const handleTicketsClick = () => {
    window.open('https://app.helpdesk.com/tickets/all', '_blank');
  };

  const handleSeeAllUsersClick = () => {
    navigate('/profile/admin/see-all-users');
  };

  /*const handleSeeAllParkingSpotsClick = () => {
    navigate('/seeallparkingspots');
  };*/

  /*const handleUnseenWarningsClick = () => {
    navigate('/unseenwarningadmin');
  };*/

  

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for parking spot" />
        <div className="mt-6 max-w-md mx-auto bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Admin panel</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Back
            </button>
            {/* <button
              onClick={handleQuestionsClick}
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300"
            >
              Questions
            </button> as long as there is openAI chatgpt integration, live chat cannot be available*/}
            <button
              onClick={handleTicketsClick}
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300"
            >
              Tickets
            </button>
            <button
              onClick={handleSeeAllUsersClick}
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300"
            >
              See all users
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default ProfileAdminPage;
