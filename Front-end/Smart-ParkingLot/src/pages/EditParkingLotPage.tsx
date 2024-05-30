import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import ParkingLot from '../types/ParkingLot';
import ParkingSpot from '../types/ParkingSpot';
import Cookies from 'js-cookie';


interface ParkingLotAndSpots {
  parkingLot: {
    name: string;
    price: number;
  };
  spots: ParkingSpot[];
}

const EditParkingLotPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [parkingLot, setParkingLot] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [spaces, setSpaces] = useState<ParkingSpot[]>([]);
  const [initialSpots, setInitialSpots] = useState<ParkingSpot[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [message, setMessage] = useState('');
  const baseURL = process.env.API_BASE_URL;
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchParkingLotDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/parking_lot/get-by-id?id=${id}`);
        if (!response.ok) {
          throw new Error('Parking lot with specified id could not be found');
        }
        const data: ParkingLotAndSpots = await response.json();

        setName(data.parkingLot.name);
        setPrice(data.parkingLot.price);
        setSpaces(data.parkingSpots);
        setInitialSpots(data.parkingSpots);  // Correctly set initial spots
        setParkingLot(data.parkingLot);
      } catch (error) {
        alert('Failed to fetch parking lot details.');
      }
    };

    fetchParkingLotDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/delete-lot`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the parking lot.');
      }

      setShowDeleteModal(false);
      navigate(-1);
    } catch (error) {
      alert('Failed to delete the parking lot.');
    }
  };

  const handleSave = async () => {
    const addedSpots = spaces.filter((spot) => !initialSpots.find((s) => s.id === spot.id));
    const changedSpots = spaces.filter((spot) => initialSpots.find((s) => s.id === spot.id && s.name !== spot.name));
    const deletedSpots = initialSpots.filter((space) => !spaces.find((s) => s.id === space.id));

    try {
      // Update existing spots
      for (let spot of changedSpots) {
        await fetch(`${baseURL}/parking_spots/update-name/${spot.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(spot),
        });
      }

      // Add new spots
      for (let spot of addedSpots) {
        await fetch(`${baseURL}/parking_spots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: null, name: spot.name, parkingLot: parkingLot }),
        });
      }

      // Delete removed spots
      for (let spot of deletedSpots) {
        await fetch(`${baseURL}/parking_spots/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify( spot ),
        });
      }

      // Update Parking lot info
      await fetch(`${baseURL}/parking_lot/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name, price }),
      });

    setMessage('Parking lot was successfully updated!');
    setShowResponse(true);

    } catch (error) {
      alert('Failed to save parking lot and spots.');
    }
  };

  const handleSpaceNameChange = (id: number | null, name: string) => {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => (space.id === id ? { ...space, name } : space))
    );
  };

  const handleAddSpace = () => {

    const maxId = spaces.reduce((max, space) => (space.id > max ? space.id : max), 0);

    const newSpace = {
      id: maxId + 1,
      name: `New Spot`,
      parkingLot: parkingLot.id
    };
    setSpaces([...spaces, newSpace]);
  };

  const handleRemoveSpace = (id: number) => {
    setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
      <div className="sticky top-0 z-50 w-full flex justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-4xl px-4">
          <SearchBar placeholder="Search for parking spot" />
        </div>
      </div>
      <div className="flex flex-col items-center flex-grow mt-4 mb-4 px-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg mb-4"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Parking Lot</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="mt-1 p-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Parking Spaces
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Parking spaces names should be easily recognizable (e.g. A1, A2, etc.) and should be printed on the ground.
              </p>
              {spaces.map((space) => (
                <div key={space.id !== null ? space.id : `new-${Math.random()}`} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={space.name}
                    onChange={(e) => handleSpaceNameChange(space.id, e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg mr-2"
                  />
                  <button
                    onClick={() => handleRemoveSpace(space.id)}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddSpace}
                className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-2"
              >
                Add Parking Space
              </button>
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-2"
              >
                Save
              </button>
            </div>
            <button
              className="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <Navbar />
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Parking Lot</h2>
            <p>Are you sure you want to delete the parking lot {name}?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg shadow-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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

export default EditParkingLotPage;
