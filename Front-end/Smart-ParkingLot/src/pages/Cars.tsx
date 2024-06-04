import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';
import Cookies from 'js-cookie';

const Cars: React.FC = () => {
    const [carDetails, setCarDetails] = useState({ plate: '', capacity: '', type: '' });
    const [userCars, setUserCars] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.API_BASE_URL;


    const token = Cookies.get('authToken');

    useEffect(() => {
        const fetchUserCars = async () => {
            try {
                const response = await fetch(`${baseUrl}/car/user-cars`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user cars');
                }

                const cars = await response.json();
                setUserCars(cars);
            } catch (error) {
                console.error('Error fetching user cars:', error);
            }
        };

        fetchUserCars();
    }, [baseUrl, token]);

    const handleAddCar = async () => {
        if (!carDetails.plate) {
            setErrorMessage('Car plate is required');
            return;
        }

        const newCarDetails = {
            plate: carDetails.plate,
            capacity: parseInt(carDetails.capacity), // Ensure capacity is an integer
            type: carDetails.type
        };

        try {
            const response = await fetch(`${baseUrl}/car/register-car`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCarDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to register car');
            }

            const message = await response.text(); // Handling text response
            console.log(message); // This should log the plain text response
            setShowAddModal(false);  // Close the modal on successful registration
            setUserCars([...userCars, newCarDetails]); // Update the user cars list
            setErrorMessage('');  // Clear any previous error messages
        } catch (error) {
            console.error('Error registering car:', error);
            setErrorMessage('Failed to register car');
        }
    };

    const handlePlateChange = (e) => {
        setCarDetails({ ...carDetails, plate: e.target.value.toUpperCase() });
    };

    const handleDeleteCar = async () => {
        if (!carToDelete) return;

        try {
            const response = await fetch(`${baseUrl}/car/delete-car`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ plate: carToDelete })
            });

            if (!response.ok) {
                throw new Error('Failed to delete car');
            }

            const message = await response.text(); // Handling text response
            console.log(message); // This should log the plain text response
            setUserCars(userCars.filter(car => car.plate !== carToDelete)); // Update the user cars list
            setShowDeleteModal(false); // Close the delete modal
            setCarToDelete(null); // Clear the car to delete
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
            <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <button
                        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <img src="/profile-Logo.png" alt="profile" className="w-24 h-24 rounded-full mx-auto" />
                    <div className="flex flex-col gap-4 mt-4 justify-center rounded-lg">
                        {userCars.map((car, index) => (
                            <div key={index} className="flex items-center bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg mb-4">
                                {car.plate}
                                <img
                                    src="/bin.png"
                                    alt="trash icon"
                                    className="w-6 h-6 ml-auto cursor-pointer"
                                    onClick={() => {
                                        setCarToDelete(car.plate);
                                        setShowDeleteModal(true);
                                    }}
                                />
                            </div>
                        ))}
                        <button
                            className="bg-purple-600 text-white font-bold py-2 px-12 rounded-lg mt-8 shadow-lg hover:bg-purple-700 transition duration-300"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Car
                        </button>
                    </div>
                </div>
            </div>
            <NavBar />

            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Add Car</h2>
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                        <input
                            type="text"
                            placeholder="Enter car plate"
                            value={carDetails.plate}
                            onChange={handlePlateChange}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Enter car capacity"
                            value={carDetails.capacity}
                            onChange={(e) => setCarDetails({ ...carDetails, capacity: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Enter car type"
                            value={carDetails.type}
                            onChange={(e) => setCarDetails({ ...carDetails, type: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg mb-4"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
                                onClick={handleAddCar}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Delete Car</h2>
                        <p>Are you sure you want to delete the car with plate {carToDelete}?</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                                onClick={handleDeleteCar}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Cars;