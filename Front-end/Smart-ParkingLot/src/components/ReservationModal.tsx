import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';

Modal.setAppElement('#root'); // Suppresses modal-related accessibility warnings.

export interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (hoursToReserve: number, carId: number) => Promise<void>; // Add this line
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
}) => {
  const [inputCarId, setInputCar] = React.useState(-1);
  const [hoursToReserve, setHoursToReserve] = React.useState(2);
  const [cars, setCars] = React.useState<Car[]>([]);
  const baseUrl = process.env.API_BASE_URL;
  const baseUrlString = baseUrl || 'http://localhost:8081';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    
    setHoursToReserve(value);
  };

  const { getUserCars } = useSavedCars();

  React.useEffect(() => {
    getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
      setCars(fetchedCars);
    });
  }, [baseUrlString, getUserCars]);

  // Set the first car as the default value
  useEffect(() => {
    setInputCar(cars[0]?.id || -1);
  }, [cars]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'none',
        },
        content: {
          position: 'relative',
          width: '80%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: 'none',
        }
      }}
    >
      <div className='text-white text-center bg-black bg-opacity-80 p-4 rounded-lg flex flex-col items-center'>
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
        <p className='p-2'>Choose Car</p>
        <select
          value={inputCarId}
          onChange={(event) => setInputCar(Number(event.target.value))}
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
        
        <div className='flex flex-row justify-evenly w-full'>
          <button className='bg-purple-600 py-0.5 px-6 rounded-lg' onClick={() => onConfirm(hoursToReserve, inputCarId)}>Yes</button>
          <button className='bg-purple-600 py-0.5 px-6 rounded-lg' onClick={onRequestClose}>No</button>
        </div>
      </div>
    </Modal>
  );
};
