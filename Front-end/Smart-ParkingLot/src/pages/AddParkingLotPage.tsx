import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Modal from 'react-modal';
import { ParkingLot } from '../types/ParkingLot';
import Cookies from 'js-cookie';

// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '80%',
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const AddMarker: React.FC<{ setLatLng: (position: LatLng) => void }> = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
};

const AddParkingLotPage: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [spaces, setSpaces] = useState(0);
  const [price, setPrice] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = Cookies.get('authToken');
    const baseURL = process.env.API_BASE_URL;

    try {
      const response = await fetch(`${baseURL}/parking_lot/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name, // Modify as needed
          nrSpots: spaces,
          price: price, // Modify as needed
          latitude: latitude,
          longitude: longitude,
        } as ParkingLot),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const message = await response.text();
      console.log(message);
      setMessage(message);
      setShowResponse(true);
      setLatitude(null);
      setLongitude(null);
      setSpaces(0);
    } catch (error) {
      console.error('Error saving parking lot:', error);
      alert('Failed to add parking lot. Please try again.');
    }
  };

  const setLatLng = (position: LatLng) => {
    setLatitude(position.lat);
    setLongitude(position.lng);
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
      <div className="sticky top-0 z-50 w-full flex justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-4xl px-4 py-2">
          <SearchBar placeholder="Search for parking spot" />
        </div>
      </div>
      <div className="flex justify-center items-center flex-grow mt-4 px-4">
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Add Parking Lot</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                required
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Latitude</label>
              <input
                type="text"
                value={latitude ?? ''}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Longitude</label>
              <input
                type="text"
                value={longitude ?? ''}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                required
              />
            </div>
            <button
              type="button"
              className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 mb-4"
              onClick={openModal}
            >
              Pick Location on Map
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Number of Parking Spaces</label>
              <input
                type="number"
                value={spaces}
                onChange={(e) => setSpaces(parseInt(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Price per Hour
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                required
                min={1}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Add Parking Lot
            </button>
          </form>
        </div>
      </div>
      <div className="sticky bottom-0 z-50 w-full bg-gray-100 dark:bg-gray-900">
        <Navbar />
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Pick Location on Map">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Pick Location</h2>
          <div className="flex-grow mb-4">
            <MapContainer center={[47.1621, 27.5886]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <AddMarker setLatLng={setLatLng} />
              {latitude && longitude && (
                <Marker position={[latitude, longitude]}>
                  <Popup>
                    Latitude: {latitude} <br /> Longitude: {longitude}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold rounded-lg shadow-lg"
          >
            Close
          </button>
        </div>
      </Modal>
      {showResponse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Response</h2>
            <p>{message}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                onClick={() => {
                            setShowResponse(false);
                            navigate(-1);
                          }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddParkingLotPage;
