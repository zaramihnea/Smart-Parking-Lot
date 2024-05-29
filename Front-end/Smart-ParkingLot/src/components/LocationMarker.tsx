import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

interface LocationMarkerProps {
  onLocationChange: (position: L.LatLng) => void;
}

const locationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/zaramihnea/Smart-Parking-Lot/main/Front-end/Smart-ParkingLot/src/assets/dot.svg',
  iconSize: [20, 20], 
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

export default function LocationMarker({onLocationChange} : LocationMarkerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newPosition = new L.LatLng(latitude, longitude);
            setPosition(newPosition);
            onLocationChange(newPosition);
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      }
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 2500);

    return () => clearInterval(intervalId);
  }, [map, onLocationChange]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}