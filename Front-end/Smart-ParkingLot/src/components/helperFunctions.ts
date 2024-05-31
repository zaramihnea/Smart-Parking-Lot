import { LatLngExpression } from "../types/LatLngExpression";

// Function to calculate the distance between two points using the Haversine formula
const calculateDistance = (point1: LatLngExpression, point2: LatLngExpression): number => {
  const toRadians = (degree: number): number => degree * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers

  const lat1 = toRadians(point1.lat);
  const lng1 = toRadians(point1.lng);
  const lat2 = toRadians(point2.lat);
  const lng2 = toRadians(point2.lng);

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
};

// Function to get the point on the route at a certain distance
const getPointAtDistance = (route: LatLngExpression[], distance: number): LatLngExpression | null => {
  let accumulatedDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
  const segmentDistance = calculateDistance(route[i], route[i + 1]);
  if (accumulatedDistance + segmentDistance > distance) {
      const overshoot = distance - accumulatedDistance;
      const segmentRatio = overshoot / segmentDistance;
      const lat = route[i].lat + (route[i + 1].lat - route[i].lat) * segmentRatio;
      const lng = route[i].lng + (route[i + 1].lng - route[i].lng) * segmentRatio;
      return { lat, lng };
  }
  accumulatedDistance += segmentDistance;
  console.log(accumulatedDistance);
  }

  return null;
};

function calculateBearing(start: LatLngExpression, end: LatLngExpression): number {
    // Helper function to convert degrees to radians
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    // Helper function to convert radians to degrees
    const toDegrees = (radians: number): number => radians * (180 / Math.PI);

    const startCoords = start;
    const endCoords = end;

    const lat1 = toRadians(startCoords.lat);
    const lat2 = toRadians(endCoords.lat);
    const deltaLon = toRadians(endCoords.lng - startCoords.lng);

    const x = Math.sin(deltaLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const initialBearing = Math.atan2(x, y);

    const initialBearingDegrees = toDegrees(initialBearing);
    const compassBearing = (initialBearingDegrees + 360) % 360;

    return compassBearing;
}


export {  getPointAtDistance, calculateBearing };