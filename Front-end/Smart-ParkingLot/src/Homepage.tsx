// src/pages/Homepage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';
import Map from './components/Map';
import useUsername from "./hooks/useUsername"
import useReservations from "./hooks/useReservations"
import { useUserContext } from './UserContext';
import useUserType from './hooks/useUserType';

import { Car } from './types/Car';
import { Reservation } from './types/Reservation';
import useSavedCars from './hooks/useSavedCars';


const Homepage: React.FC = () => {
  const baseUrl = process.env.API_BASE_URL;
  const [baseUrlString]= useState<string>(baseUrl || 'http://localhost:8081');

  const { userType, setUserType } = useUserContext();
  const [username, setUsername] = useState('username');
  const [savedCars, setSavedCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spotToNavigateTo, setSpotToNavigateTo] = useState<number>(0);

  const { getUserType } = useUserType();
  const { getUsername } = useUsername();
  const { getUserCars } = useSavedCars();
  const { getOwnActiveReservations, cancelReservation } = useReservations();
  
  // Fetch username
  useEffect(() => {
    getUsername(baseUrlString).then((name) => {
      setUsername(name);
    });
  }, [baseUrlString, getUsername]); // Dependencies
  
  // Fetch saved cars using getUserCars to show the cars on the homepage
  useEffect(() => {
    getUserCars(baseUrlString).then((cars) => {
      setSavedCars(cars);
    });
  }, [baseUrlString, getUserCars]); 

  const refreshReservations = useCallback(() => {
    getOwnActiveReservations(baseUrlString).then((reservations) => {
      setReservations(reservations);
    });
  }, [baseUrlString, getOwnActiveReservations]);
  
  // Fetch reservations
  useEffect(() => {
    refreshReservations();
  }, []); // Dependencies


  useEffect(() => {
      const fetchUserType = async () => {
        try {
          const fetchedUserType = await getUserType(baseUrlString);
          setUserType(fetchedUserType);
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      };

      fetchUserType();
    }, [getUserType, setUserType, baseUrl]);

    const cancelReservationHandler = useCallback((reservationId: number) => {
      cancelReservation(baseUrlString, reservationId).then(() => {
        refreshReservations();
      });
    }, [baseUrlString, cancelReservation, refreshReservations]);

  const handleLogout = useCallback(() => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const reservationId = e.currentTarget.dataset.reservationId;

    const spotId = reservations.find(reservation => reservation.id === Number(reservationId))?.spot_id; 

    setSpotToNavigateTo(spotId || -1);

  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-16">
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900">
        <SearchBar placeholder="Search for parking spot" />
        
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-semibold">Welcome, {username}!</h1>
          <a href="/profile" className='bg-purple-600 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300' onClick={handleLogout}>Logout</a>
        </div>
      </div>
      <div className='m-auto'>
        <p>Click on map to set user location</p>
        </div>   
      <div className="flex justify-center items-center flex-grow mt-4 mb-4 px-4">
        <div className="w-full max-w-4xl h-96 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden z-0 space-y">
          <Map 
            onReservationConfirmed={refreshReservations}
            setSpotToNavigateTo={setSpotToNavigateTo}
            spotToNavigateTo={spotToNavigateTo}
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-medium mb-4">Reservations</h2>
        {reservations.length === 0 && <p className='text-gray-400'>No active reservations. Hurry up and give us your money</p>}
        {reservations.map((reservation) => (
          <div key={reservation.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
            <div className="flex-1 mb-2 md:mb-0">
              <p className="font-semibold">Address: {reservation.address}</p>
              <p className="text-sm">Spot: {reservation.spot_id}</p>
              <p className="text-sm">Start Time: {reservation.start_date}</p>
              <p className="text-sm">End Time: {reservation.end_date}</p>
              <p className="text-sm">License Plate: {
                savedCars.find(car => car.id === reservation.car_id)?.plate || 'Unknown'
              }</p>
            </div>
            <button 
              key={reservation.id}
              className='bg-purple-600 m-1 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300'
              onClick={handleNavigate}
              data-reservation-id={reservation.id}
            >
              Navigate to to parking lot
            </button>
            {<a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.latitude + ',' + reservation.longitude)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 m-1 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Open on Google Maps
            </a>}
            <button
              onClick={() => cancelReservationHandler(reservation.id)}
              className="bg-red-600 m-1 text-white px-2 py-1 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Saved Cars</h2>
        <div>
          {savedCars.length === 0 && <p className='text-gray-400'>No saved cars</p>}
          {savedCars.map((car, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
              <div>
                <p className="font-semibold">{car.model}</p>
                <p className="text-sm">{car.plate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 z-50">
        <Navbar />
      </div>
    </div>
  );
};

export default Homepage;
