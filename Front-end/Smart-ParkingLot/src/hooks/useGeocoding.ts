// Define interfaces for the API response
interface GeocodeLocation {
  lat: number;
  lng: number;
}

interface GeocodeResult {
  geometry: {
    location: GeocodeLocation;
  };
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
}

import axios from 'axios';
import { useState, useEffect } from 'react';


// Custom hook to fetch coordinates from an address
const useGeocoding = (address: string | null) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!address) return; // Do nothing if the address is not provided

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    axios.get<GeocodeResponse>(url)
      .then(response => {
        if (response.data.status === 'OK') {
          const { lat, lng } = response.data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          setError('No results found');
        }
      })
      .catch(err => {
        setError('Failed to fetch coordinates');
        console.error(err);
      });
  }, [address]);

  return { coordinates, error };
};

export default useGeocoding;