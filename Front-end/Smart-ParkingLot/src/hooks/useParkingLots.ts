import { useCallback } from "react";
import { ParkingLot } from "../types/ParkingLot";

interface ParkingLotsAndClosestLot {
  parkingLots: ParkingLot[];
  closestLot: ParkingLot | null;
}

export default function useParkingLots() {
  const getAvailableParkingLotsAndClosestLot = useCallback((
    baseUrl: string,
    radius: number,
    latitude: number,
    longitude: number,
    startTime: string,
    stopTime: string
  ): Promise<ParkingLotsAndClosestLot> => {
    return fetch(`${baseUrl}/parking_lot/available-spots-search?radius=${radius}&latitude=${latitude}&longitude=${longitude}&start_time=${startTime}&stop_time=${stopTime}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const parkingLots: ParkingLot[] = [];
      let closestLot: ParkingLot | null = null;
      let minDistance = Infinity;

      for (const parkingLotData of data) {
        const lot: ParkingLot = {
          id: parkingLotData.parkingLot.id,
          adminEmail: parkingLotData.parkingLot.adminEmail,
          name: parkingLotData.parkingLot.name,
          nrSpots: parkingLotData.parkingLot.nrSpots,
          price: parkingLotData.parkingLot.price,
          latitude: parkingLotData.parkingLot.latitude,
          longitude: parkingLotData.parkingLot.longitude,
          parkingSpotsIds: parkingLotData.parkingSpotsIds,
        };

        parkingLots.push(lot);

        const distance = getDistanceFromLatLonInKm(latitude, longitude, lot.latitude, lot.longitude);
        if (distance < minDistance) {
          minDistance = distance;
          closestLot = lot;
        }
      }

      return { parkingLots, closestLot };
    })
    .catch(error => {
      console.error('Error:', error);
      return { parkingLots: [], closestLot: null };
    });
  }, []);

  const getParkingLots = useCallback((
    baseUrl: string,
    radius: number,
    latitude: number,
    longitude: number
  ): Promise<ParkingLot[]> => {
    return fetch(`${baseUrl}/parking_lot/search?radius=${radius}&latitude=${latitude}&longitude=${longitude}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const parkingLots: ParkingLot[] = [];

      for (const parkingLotData of data) {
        const lot: ParkingLot = {
          id: parkingLotData.parkingLot.id,
          adminEmail: parkingLotData.parkingLot.adminEmail,
          name: parkingLotData.parkingLot.name,
          nrSpots: parkingLotData.parkingLot.nrSpots,
          price: parkingLotData.parkingLot.price,
          latitude: parkingLotData.parkingLot.latitude,
          longitude: parkingLotData.parkingLot.longitude,
          parkingSpotsIds: parkingLotData.parkingSpotsIds,
        };

        parkingLots.push(lot);
      }

      return parkingLots;
    })
    .catch(error => {
      console.error('Error:', error);
      return [];
    });
  }, []);

  return { getAvailableParkingLotsAndClosestLot, getParkingLots };
}


function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}