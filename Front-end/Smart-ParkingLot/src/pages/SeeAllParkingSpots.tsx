import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

interface ParkingSpot {
  id: number;
  position: LatLng;
  price: number;
  nrSpots: number;
}

const AddMarker: React.FC<{ addParkingSpot: (position: LatLng) => void }> = ({ addParkingSpot }) => {
  useMapEvents({
    click(e) {
      addParkingSpot(e.latlng);
    }
  });
  return null;
};

const SeeAllParkingSpots: React.FC = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, address: 'Pending address 1' },
    { id: 2, address: 'Pending address 2' }
  ]);
  const navigate = useNavigate();

  const addParkingSpot = (position: LatLng) => {
    const newSpot: ParkingSpot = {
      id: parkingSpots.length + 1,
      position,
      price: 5, // Default price
      nrSpots: 10 // Default number of spots
    };
    setParkingSpots([...parkingSpots, newSpot]);
  };

  const handleManualAdd = () => {
    if (!manualLat || !manualLng) return;
    const position = new LatLng(parseFloat(manualLat), parseFloat(manualLng));
    addParkingSpot(position);
    setManualLat('');
    setManualLng('');
  };

  const deleteParkingSpot = (id: number) => {
    setParkingSpots(parkingSpots.filter(spot => spot.id !== id));
  };

  const handleAddRequest = (id: number) => {
    const request = pendingRequests.find(req => req.id === id);
    if (request) {
      const position = new LatLng(47.1621, 27.5886); // Example position, replace with actual logic
      addParkingSpot(position);
      setPendingRequests(pendingRequests.filter(req => req.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for parking spot" />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-500">All Parking Spaces</h1>
          <button
            onClick={() => navigate('/profileadminpage')} // Navigate back to the profile admin page
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Back
          </button>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {parkingSpots.map(spot => (
            <div key={spot.id} className="mb-4 flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md">
              <span className="text-white">Space {spot.id}: {spot.position.lat.toFixed(2)}, {spot.position.lng.toFixed(2)}</span>
              <button
                onClick={() => deleteParkingSpot(spot.id)}
                className="ml-2 px-2 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 14H6L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Latitude"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
            />
            <button
              onClick={handleManualAdd}
              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              Add manually
            </button>
          </div>
        </div>
        <div className="mt-4">
          <MapContainer center={[47.16212698716967, 27.588606476783752]} zoom={14} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddMarker addParkingSpot={addParkingSpot} />
            {parkingSpots.map(spot => (
              <Marker key={spot.id} position={spot.position}>
                <Popup>
                  Space {spot.id} <br />
                  Spots: {spot.nrSpots} <br />
                  Price per hour: {spot.price} RON <br />
                  <button 
                    onClick={() => deleteParkingSpot(spot.id)}
                    className="mt-2 px-2 py-1 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-500 mb-4">Pending request for parking spots/spaces</h2>
          {pendingRequests.map(request => (
            <div key={request.id} className="mb-4 flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md">
              <span className="text-white">{request.address}</span>
              <button
                onClick={() => handleAddRequest(request.id)}
                className="ml-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default SeeAllParkingSpots;
