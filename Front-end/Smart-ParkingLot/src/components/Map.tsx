import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

// temporary function to get coordinates for parking lots when clicking the map
function LocationMarker() {
    useMapEvents({
        click(e: any) {
            alert(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
        },
    });
    return null;
}

function Map() {
    // hardcoded parking lot for demo
    const hardcodedParkingLot = {
        id: "Parcare Xenopol demo",
        nrSpots: 14,
        price: 6,
        latitude: 47.17410240,
        longitude: 27.57246130
    };

    const availableHardcodedParkingLot = {
        id: "Parcare Xenopol demo",
        nrSpots: 3,
        price: 6,
        latitude: 47.17410240,
        longitude: 27.57246130
    };

    // center of the map, currently set on Iasi
    const centerOfIasi: LatLngExpression = [47.16212698716967, 27.588606476783752];
    
    // full parking lot info
    const [parkingLots, setParkingLots] = useState([hardcodedParkingLot]);
    
    // info of available parking spots between a timeframe
    const [availableParkingLots, setAvailableParkingLots] = useState([availableHardcodedParkingLot]);
    
    // fetching parkingLots (backend documentation item nr.6)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8081/parking_lot/search?radius=100&latitude=47.1741024&longitude=27.5724613");
                if (!response.ok) {
                    throw new Error('Network error ' + response.statusText);
                }
                const data = await response.json();
                setParkingLots(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    // fetching availableParkingLots (backend documentation item nr.7)
    useEffect(() => {
        const fetchData = async () => {
            const formattedStartTime = new Date().toISOString();
            const formattedEndTime = new Date(new Date().setHours(new Date().getHours() + 1)).toISOString();

            try {
                const url = `http://localhost:8081/parking_lot/available-spots-search?radius=100&latitude=47.1741024&longitude=27.5724613&start_time=${formattedStartTime}&stop_time=${formattedEndTime}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network error ' + response.statusText);
                }
                const data = await response.json();
                setAvailableParkingLots(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        fetchData();
    }, []);

    // adding field 'availableSpots' to parkingLots that is equal to availableParkingLots.nrSpots
    const mergedParkingLots = parkingLots.map(lot => {
        const availableLot = availableParkingLots.find(availableLot => availableLot.id === lot.id);
        return {
            ...lot,
            availableSpots: availableLot ? availableLot.nrSpots : 0
        };
    });

    // TODO: action when user clicks 'Reserve' button
    const handleReserveClick = async (lotId: string) => {
        if (window.confirm(`Reserve a parking spot at ${lotId}?`)) {

            alert(`Reserved spot at lot ${lotId}`); //demo

            /*
            const reservationDetails = {
                spotID: lotId,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                carPlate: carPlate,
                carCapacity: carCapacity,
                carType: carType
            };

            try {
                // backend documentation item nr.10
                const response = await fetch("http://localhost:8081/reservation/reserve", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify(reservationDetails)
                });

                const message = await response.text();

                switch (message) {
                    case "Invalid token":
                        alert("Invalid token");
                        break;
                    case "Parking spot not available":
                        alert("Parking spot not available");
                        break;
                    case "User does not have enough money in his balance":
                        alert("Not enough money");
                        break;
                    case "Spot reserved successfully":
                        alert("Spot reserved successfully");
                        break;
                    default:
                        alert("Unexpected response: " + message);
                        break;
                }
            } catch (error) {
                console.error('Reservation error:', error);
                alert('An error occurred while reserving the spot.');
            }
            */
        }
    };

    return (
        <MapContainer center={centerOfIasi} zoom={14} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {mergedParkingLots.map(lot => (
                <Marker key={lot.id} position={[lot.latitude, lot.longitude]}>
                    <Popup>
                        {lot.id} <br />
                        Spots: {lot.availableSpots} / {lot.nrSpots} <br />
                        Price per hour: {lot.price} RON <br />
                        {lot.availableSpots !== 0 && (
                            <button onClick={() => handleReserveClick(lot.id)}>Reserve</button>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;