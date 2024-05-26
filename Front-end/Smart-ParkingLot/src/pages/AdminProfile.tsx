import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';

const Profiles: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <img src="/profile-Logo.png" alt="profile" className="w-24 h-24 rounded-full mx-auto" />
                    <div className="flex flex-col gap-4 mt-4 justify-center rounded-lg">
                        <button
                            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-12 rounded-lg shadow-lg"
                            onClick={() => navigate('/profile/details')}
                        >
                            Details
                        </button>
                        <button
                            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-12 rounded-lg shadow-lg"
                            onClick={() => navigate('/profile/cars')}
                        >
                            Cars
                        </button>
                        <button
                            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-12 rounded-lg shadow-lg"
                            onClick={() => navigate('/profile/reserve')}
                        >
                            Reserve
                        </button>
                        <button
                            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-12 rounded-lg shadow-lg"
                            onClick={() => navigate('/profile/admin')}
                        >
                            Admin Panel
                        </button>
                        <button className="bg-purple-600 text-white font-bold py-2 px-12 rounded-lg mt-8 shadow-lg hover:bg-purple-700 transition duration-300">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <NavBar />
        </div>
    );
};

export default Profiles;