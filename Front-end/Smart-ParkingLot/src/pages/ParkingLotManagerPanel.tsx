import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const AdminPanelPage: React.FC = () => {
    const navigate = useNavigate();

    const parkingLots = [
        { id: 1, name: 'Lot 1' },
        { id: 2, name: 'Lot 2' },
        { id: 3, name: 'Lot 3' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <button
                        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
                        onClick={() => navigate('/profile')}
                    >
                        Back
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Parking Lots</h2>
                    <div className="space-y-4">
                        {parkingLots.map((lot) => (
                            <div key={lot.id} className="flex justify-between items-center">
                                <span>{lot.name}</span>
                                <button
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300"
                                    onClick={() => navigate(`/profile/admin-parking-panel/edit-parking-lot/${lot.id}`)}
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                        <button
                            className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                            onClick={() => navigate('/profile/admin-parking-panel/add-parking-lot')}
                        >
                            Add Parking Lot
                        </button>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default AdminPanelPage;
