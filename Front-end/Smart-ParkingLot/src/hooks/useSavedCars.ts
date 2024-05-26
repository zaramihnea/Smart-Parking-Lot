import { useCallback } from "react";
import { Car } from "../types/Car";

export default function useSavedCars() {
  const getUserCars = useCallback((baseUrl: string): Promise<Car[]> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0].includes('authToken'));

    if (!authToken) {
      // Ensure that we return a Promise even if there is no auth token
      return Promise.resolve([]);
    }

    return fetch(`${baseUrl}/car/user-cars`, {
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
      const cars: Car[] = [];
      for (const carData of data) {
        cars.push(
          {
            id: carData.id,
            model: carData.type,
            plate: carData.plate,
            capacity: carData.capacity
          }
        )
      }
      return cars;
    })
    .catch(error => {
      console.error('Error:', error);
      // Even in case of error, we return a consistent type: an empty array inside a Promise
      return [];
    });
  }, []);

  return { getUserCars };
}