import { useLocation, useNavigate } from 'react-router-dom';
import useGeocoding from '../hooks/useGeocoding';
import { ParkingLot } from '../types/ParkingLot';
import { SetStateAction, useEffect, useState } from 'react';
import useParkingLots from '../hooks/useParkingLots';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';
import useReservations from '../hooks/useReservations';

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
  
  const { coordinates }  = useGeocoding(adresss);

  const { getParkingLotsAndClosestLot } = useParkingLots();
  
  // fetch the parking lots for the given coordinates
  // show the closest parking lot to the user as parking location
  // choose any number from the parkingspot array for the parking spot
  useEffect(() => {
    const radius = 3000;
    const startTime = new Date(); // Current time
    const stopTime = new Date(startTime.getTime() + 15 * 60 * 60 * 1000); // 15 hours from now
    startTime.setMilliseconds(0);
    stopTime.setMilliseconds(0);

    const formattedStartTime = startTime.toISOString().slice(0, 19) + 'Z';
    const formattedStopTime = stopTime.toISOString().slice(0, 19) + 'Z';

    getParkingLotsAndClosestLot(baseUrlString, radius, coordinates? coordinates.lat : 0, coordinates? coordinates.lng : 0, formattedStartTime, formattedStopTime).then((parkingLots) => {
      setClosestParkingLot(parkingLots.closestLot);
      setSpotChosen(parkingLots.closestLot?.parkingSpotsIds[0] || -1);
      
    });
  }, [baseUrlString, getParkingLotsAndClosestLot, coordinates]);

  const [hoursToReserve, setHoursToReserve] = useState('2');
  const [invalidHoursAlert, setErrorMessage] = useState('');

  const [cars, setCars] = useState<Car[]>([]);
  const [input, setInput] = useState(-1);

  const { getUserCars } = useSavedCars();

  useEffect(() => {
    getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
      setCars(fetchedCars);

    });
  }, [baseUrlString, getUserCars]);
  
  // set the first car as the default car
  useEffect(() => {
    if (cars.length > 0) {
      setInput(cars[0].id);
    }
  }, [cars]);

  const { reserveParkingSpot } = useReservations();

  const handleAccept = () => {
    // get the number of hours the user wants to reserve the spot for
    // get the car from the cars dropdown
    // request reservation for the parking spot from the server
    // if the reservation failed, show the correct error message
    // if the reservation was successful, navigate to the homepage
    
    const hours = parseInt(hoursToReserve, 10);
    // Handle invalid input
    
    if (!(!isNaN(hours) && hours >= 1 && hours <= 72)) {
      setErrorMessage('Please enter a number between 1 and 72 for the reservation hours.');
      return; 
    }
    
    // Find the car by the id
    const car = cars.find(car => car.id === input);

    console.log(car);

    if (car === undefined) {
      setErrorMessage('Please get a car to reserve the spot.');
      return;
    }
    setErrorMessage('');

    const now = new Date();

    const startTime = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
    const stopTime = new Date(new Date().getTime() + (hours + 3) * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z'; 
    
    console.log(startTime, stopTime);
    // Reserve the parking spot
    reserveParkingSpot(baseUrlString, spotChosen, startTime, stopTime, car.plate, car.capacity, car.model).then((response) => {
      if (response === 'Spot reserved successfully') {
        navigate('/home');
      } else {
        setErrorMessage(response);
      }
    });
  };

  const handleCancel = () => {
    navigate('/home');
  };

  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setHoursToReserve(event.target.value);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl mb-4">This is what we found:</h1>
      <div className="border p-4 mb-4 bg-white dark:bg-gray-800 rounded shadow-md">
        <p><strong>Parking Location:</strong> {closestParkingLot? closestParkingLot.name : "Invalid adress chosen"}</p>
        <p><strong>Parking Spot:</strong> { spotChosen }</p>
      </div>
      <div>
        <p>Choose Car</p>
        <select
          value={input}
          onChange={(event) => setInput(Number(event.target.value))}
          className="w-64 bg-gray-100 dark:bg-gray-800 text-white p-2 rounded-md mb-4"
        > 
          {cars.length === 0 && <option value=''>No cars saved</option>}
          {cars.map((car: Car) => (
            <option key={car.id} value={car.id}>{car.model}, {car.plate}</option>
          ))}
        </select>
      </div>
      <div className='flex flex-row items-center'>
        <p className="mb-4">Hours to reserve spot for:</p>
        <input 
        type="text" 
        value={hoursToReserve}
        onChange={handleInputChange}
        className="ml-3 w-16 grow border bg-gray-100 dark:bg-gray-800 text-white p-2 rounded-md mb-4 " />
      </div>
      {invalidHoursAlert && <p className="text-red-500 my-4 text text-center">{invalidHoursAlert}</p>}
      <div className="flex space-x-4">
        <button 
          onClick={handleAccept} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Reserve
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