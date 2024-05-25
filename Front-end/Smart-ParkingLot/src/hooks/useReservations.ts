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

  return { getOwnActiveReservations };
}