import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';
import { User } from '../types/User';
import Cookies from 'js-cookie';


const Details: React.FC = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState<User>({
        email: '',
        name: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('authToken');
            const baseUrl = process.env.API_BASE_URL;

            try {
                const response = await fetch(`${baseUrl}/user/details`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data: User = await response.json();
                setUserDetails(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <button
                        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <img src="/profile-Logo.png" alt="profile" className="w-24 h-24 rounded-full mx-auto" />
                    <div className="flex flex-col gap-4 mt-4 justify-center rounded-lg">
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-8 rounded-lg shadow-lg">
                            {userDetails.name}
                        </button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-8 rounded-lg shadow-lg">
                             {`${userDetails.city}, ${userDetails.country}`}
                        </button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-8 rounded-lg shadow-lg">
                            {userDetails.email}
                        </button>
                    </div>
                </div>
            </div>
            <NavBar />
        </div>
    );
};

export default Details;
