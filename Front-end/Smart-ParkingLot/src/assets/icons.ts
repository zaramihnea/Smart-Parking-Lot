import L from 'leaflet';
import arrowIconUrl from './arrow.svg';

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

const arrowIcon = new L.Icon({
  iconUrl: arrowIconUrl,
  iconSize: [50, 50], // Adjust the size as needed
  iconAnchor: [25, 25], // Ensure the anchor is at the center
  popupAnchor: [0, -25],
});

const locationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/zaramihnea/Smart-Parking-Lot/main/Front-end/Smart-ParkingLot/src/assets/dot.svg',
  iconSize: [20, 20], 
  iconAnchor: [10, 10],
  popupAnchor: [10, 10],
});


export { greenIcon, redIcon, orangeIcon, arrowIcon, locationIcon }