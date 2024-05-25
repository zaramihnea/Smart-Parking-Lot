import { useLocation, useNavigate } from 'react-router-dom';
import useGeocoding from '../hooks/useGeocoding';
import { ParkingLot } from '../types/ParkingLot';
import { useEffect, useState } from 'react';
import useParkingLots from '../hooks/useParkingLots';

export default function ResultsPage() {
  const baseUrl = process.env.API_BASE_URL;

  const [closestParkingLot, setClosestParkingLot] = useState<ParkingLot | null>(null);
  const [baseUrlString]= useState<string>(baseUrl || 'http://localhost:8081');
  const [spotChosen, setSpotChosen] = useState<number>(-1);

  const locationURL = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(locationURL.search);
  
  
  // get location adress from geocoding api conversion
  const adresss = searchParams.get('address');
  
  const { coordinates, error }  = useGeocoding(adresss);

  const { getParkingLotsAndClosestLot } = useParkingLots();

  // fetch parking lots
  useEffect(() => {
    const radius = 3000;
    const startTime = '2024-05-24T12:00:00Z';
    const stopTime = '2024-05-27T23:00:00Z';

    getParkingLotsAndClosestLot(baseUrlString, radius, coordinates? coordinates.lat : 0, coordinates? coordinates.lng : 0, startTime, stopTime).then((parkingLots) => {
      console.log(parkingLots.parkingLots);
      console.log(parkingLots.closestLot);
      setClosestParkingLot(parkingLots.closestLot);
      setSpotChosen(parkingLots.closestLot?.parkingSpotsIds[0] || -1);
      
    });
  }, [baseUrlString, getParkingLotsAndClosestLot, coordinates]);


  // fetch the parking lots for the given coordinates
  // show the closest parking lot to the user as parking location
  // choose any number from the parkingspot array for the parking spot

  console.log(coordinates, error);

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
        <p><strong>Parking Location:</strong> {closestParkingLot? closestParkingLot.name : "Invalid adress chosen"}</p>
        <p><strong>Parking Spot:</strong> { spotChosen }</p>
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