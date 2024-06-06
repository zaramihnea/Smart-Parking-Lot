import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import { ParkingLot } from '../types/ParkingLot';
import Cookies from 'js-cookie';


const AdminPanelPage: React.FC = () => {
    const navigate = useNavigate();
    const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);

    useEffect(() => {
        const fetchParkingLots = async () => {
            const token = Cookies.get('authToken');
            const baseURL = process.env.API_BASE_URL;

            try {
                const response = await fetch(`${baseURL}/admin/my-parking-lots`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data: ParkingLot[] = await response.json();
                setParkingLots(data);
            } catch (error) {
                console.error('Error fetching parking lots:', error);
            }
        };

        fetchParkingLots();
    }, []);

    const handleLotNotificationsClick = () => {
        navigate('/profile/admin-parking-panel/see-lot-notifs')
      }

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
                        {parkingLots.map((lot, index) => (
                            <div key={lot.id} className={`flex justify-between items-center ${index !== parkingLots.length - 1 ? 'border-b-2 py-4' : ''}`}>
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
                    <button
              onClick={handleLotNotificationsClick}
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300"
            >
              Lot Notifications
            </button>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default AdminPanelPage;
