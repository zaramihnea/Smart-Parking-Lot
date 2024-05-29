import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { ParkingLot } from '../types/ParkingLot';
import useParkingLots from '../hooks/useParkingLots';
import { ConfirmationModal } from './ReservationModal';
import useReservations from '../hooks/useReservations';
import { Car } from '../types/Car';
import useSavedCars from '../hooks/useSavedCars';
import LocationMarker from './LocationMarker';
import RoutingMachine from "../components/RoutingControl";

const maps = {
    base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};


// Define custom icons
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to calculate the distance between two points
const calculateDistance = (point1: L.LatLng, point2: L.LatLng): number => {
    return point1.distanceTo(point2);
  };
  
  // Function to get the point on the route at a certain distance
  const getPointAtDistance = (route: L.LatLng[], distance: number): L.LatLng | null => {
    let accumulatedDistance = 0;
  
    for (let i = 0; i < route.length - 1; i++) {
      const segmentDistance = calculateDistance(route[i], route[i + 1]);
      if (accumulatedDistance + segmentDistance > distance) {
        const overshoot = distance - accumulatedDistance;
        const segmentRatio = overshoot / segmentDistance;
        const lat = route[i].lat + (route[i + 1].lat - route[i].lat) * segmentRatio;
        const lng = route[i].lng + (route[i + 1].lng - route[i].lng) * segmentRatio;
        return L.latLng(lat, lng);
      }
      accumulatedDistance += segmentDistance;
      console.log(accumulatedDistance);
    }
  
    return null;
  };
  

function Map() {
    const baseUrl = process.env.API_BASE_URL;
    const [baseUrlString]= useState<string>(baseUrl || 'http://localhost:8081');
    
    // center of the map, currently set on Iasi
    // wrap the centerOfIasi in a useMemo hook to avoid recalculating it on every render
    const centerOfIasi: LatLngExpression = useMemo(() => [47.151146, 27.574344], []);
    const [userPosition, setUserPosition] = useState<LatLngExpression>(centerOfIasi);
    // const [position, setPosition] = useState<L.LatLngExpression>([51.505, -0.09]);
    const [route, setRoute] = useState<L.LatLng[]>([]);
    const [pointOnRoute, setPointOnRoute] = useState<L.LatLng | null>(null);
    const [routingMachineKey, setRoutingMachineKey] = useState<number>(0);
    
    const [availableParkingLots, setAvailableParkingLots] = useState<ParkingLot[]>([]);
    const {getAvailableParkingLotsAndClosestLot } = useParkingLots();
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const [lotToReserve, setLotToReserve] = useState<number>(-1);

    const [cars , setCars] = useState<Car[]>([]);
    const { getUserCars } = useSavedCars();
    const { reserveParkingSpot } = useReservations();

    const [start, setStart] = useState<LatLngExpression>(centerOfIasi);
    const [end, setEnd] = useState<LatLngExpression>(centerOfIasi);


    // fetching availableParkingLots (backend documentation item nr.7)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const radius = 3000;
                const startTime = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
                const stopTime = new Date(new Date().getTime() + 15 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z'; 

                const data = await getAvailableParkingLotsAndClosestLot(baseUrlString, radius, centerOfIasi[0], centerOfIasi[1], startTime, stopTime);
                setAvailableParkingLots(data.parkingLots);
                console.log(data);
                setEnd([data.closestLot!.latitude, data.closestLot!.longitude]);
                console.log("End set to", data.closestLot!.latitude, data.closestLot!.longitude);
                // setRoutingMachineKey(routingMachineKey + 1);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        fetchData();
    }, [baseUrlString, getAvailableParkingLotsAndClosestLot, centerOfIasi]);

    const handleReserveClick = async (lotId: number) => {
        console.log("Reserving spot at lot", lotId);
        setLotToReserve(lotId);
        setModalTitle('Confirmation');
        setModalMessage(`Reserve parking spot at this parking lot?`);
        setModalIsOpen(true);
        setRoutingMachineKey(routingMachineKey + 1);
    };

    useEffect(() => {
        getUserCars(baseUrlString).then((fetchedCars: Car[]) => {
            setCars(fetchedCars);
        });
    }, [baseUrlString, getUserCars]);

    const confirmReservation = async (hoursToReserve: number, carId: number) => {
        setModalIsOpen(false);

        const now = new Date();

        const startTime = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z';
        const stopTime = new Date(new Date().getTime() + (hoursToReserve + 3) * 60 * 60 * 1000).toISOString().slice(0, 19) + 'Z'; 
        
        const car = cars.find(car => car.id === carId);

        if(!car) {
            alert('Car not found');
            return;
        }

        const parkingLot: ParkingLot | undefined = availableParkingLots.find(lot => lot.id === lotToReserve);

        if(!parkingLot) {
            alert('Parking lot not found');
            return;
        }

        const parkingSpotIdToReserve = parkingLot.parkingSpotsIds[0];

        const result = await reserveParkingSpot(baseUrlString, parkingSpotIdToReserve, startTime, stopTime, car.plate, car.capacity, car.model);

        if (result === 'Spot reserved successfully') {
            window.location.reload()
        } else {
            alert('Reservation failed: ' + result);
        }
    };

    const handleLocationChange = (position: L.LatLng) => {
        setUserPosition([position.lat, position.lng]);
        setStart([position.lat, position.lng]);
        // setRoutingMachineKey(routingMachineKey + 1);
    }
    
    useEffect(() => {
        console.log("Getting route point");
        console.log(route);
        if (route.length > 0) {
            console.log("Route found");    
            const point = getPointAtDistance(route, 50); // 50 meters from user location
            setPointOnRoute(point);
        }
      }, [route]);

    return (
        <MapContainer center={centerOfIasi} zoom={14} style={{ height: '100%', width: '100%' } } zoomControl={false}>
            <TileLayer
            url={maps.base}
        />
        {availableParkingLots.map(lot => {
            let availabilityPercentage;
            if(lot.parkingSpotsIds.length === 0) {
                availabilityPercentage = 0;
            }
            else {
                availabilityPercentage = lot.parkingSpotsIds.length /  lot.nrSpots * 100;
            }

            const spotsAvailable = `${lot.parkingSpotsIds.length} / ${lot.nrSpots}`;
            let icon = greenIcon;
            if (availabilityPercentage === 0) {
                icon = redIcon;
            } else if (availabilityPercentage < 30) {
                icon = orangeIcon;
            }

            return (
                <Marker
                    key={lot.id}
                    position={[lot.latitude, lot.longitude]}
                    icon={icon}
                >
                    <Popup>
                        <p>{lot.name}</p>
                        <p>Spots: {spotsAvailable}</p>
                        <p>Price per hour: {lot.price} RON</p>
                        {availabilityPercentage !== 0 && (
                            <button className='bg-purple-500 hover:bg-purple-700 transition duration-300 text-white font-bold py-2 px-4 rounded-full
                            ' onClick={() => handleReserveClick(lot.id)}>Reserve</button>
                        )}
                    </Popup>
                </Marker>
            )})}
            <div className='flex justify-center align-middle items-center content-center'>
                <ConfirmationModal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    onConfirm={confirmReservation}
                    title={modalTitle}
                    message={modalMessage}
                />
            </div>
            <LocationMarker onLocationChange={handleLocationChange} />
            <RoutingMachine position={"topleft"} start={start} end={end} color={"#757de8"} key={routingMachineKey} onRouteFound={setRoute} />
            {pointOnRoute && <Marker position={pointOnRoute} />}
            {route.length > 0 && <Polyline positions={route} color="#757de8" />}
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Terrain">
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={maps.base}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Dark">
                    <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        </MapContainer >
    );
}

export default Map;