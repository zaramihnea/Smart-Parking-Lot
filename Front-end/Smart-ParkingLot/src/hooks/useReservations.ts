import { useCallback } from "react";
import { Reservation } from "../types/Reservation";

export default function useReservations() {
  const getOwnActiveReservations = useCallback((baseUrl: string): Promise<Reservation[]> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0].includes('authToken'));

    if (!authToken) {
      // Ensure that we return a Promise even if there is no auth token
      return Promise.resolve([]);
    }

    return fetch(`${baseUrl}/reservation/get-own-active-reservations-with-name`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken[1]}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const reservations: Reservation[] = [];
      for (const reservationData of data) {
        reservations.push(
          {
            id: reservationData.id,
            address: reservationData.name,
            spot_id: reservationData.parking_spot_id,
            start_date: reservationData.start_time,
            end_date: reservationData.stop_time,
            car_id: reservationData.car_id,
            latitude: reservationData.latitude,
            longitude: reservationData.longitude,
          }
        )
      }
      return reservations;
    })
    .catch(error => {
      console.error('Error:', error);
      // Even in case of error, we return a consistent type: an empty array inside a Promise
      return [];
    });
  }, []);

  const reserveParkingSpot = useCallback((baseUrl: string, parkingSpotId: number, startTime: string, stopTime: string, carPlate: string, carCapacity: number, carType: string): Promise<string> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0].includes('authToken'));

    if (!authToken) {
      // Ensure that we return a Promise even if there is no auth token
      return Promise.resolve("Not logged in");
    }

    return fetch(`${baseUrl}/reservation/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken[1]}`,
      },
      body: JSON.stringify({
        spotID: parkingSpotId,
        startTime: startTime,
        endTime: stopTime,
        carPlate: carPlate,
        carCapacity: carCapacity,
        carType: carType,
      }),
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      return "Internal Server error. Try again later";
    });
  }, []);

  const cancelReservation = useCallback((baseUrl: string, reservationId: number): Promise<string> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0].includes('authToken'));

    if (!authToken) {
      // Ensure that we return a Promise even if there is no auth token
      return Promise.resolve("Not logged in");
    }

    return fetch(`${baseUrl}/reservation/cancel/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken[1]}`,
      },
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      return "Internal Server error. Try again later";
    });
  }, []);

  return { getOwnActiveReservations, reserveParkingSpot, cancelReservation };
}