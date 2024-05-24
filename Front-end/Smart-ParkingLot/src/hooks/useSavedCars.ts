import { useEffect } from "react";
import { Car } from "../types/Car";

export default function useSavedCars(baseUrl: string, setSavedCars: React.Dispatch<React.SetStateAction<{ brand: string; model: string; plate: string; }[]>>) {
  useEffect(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    for (const cookie of cookies) {
      if (cookie[0] && cookie[0].includes('authToken')) {
        console.log("User is logged in");
        fetch(`${baseUrl}/car/user-cars`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cookie[1]}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            const car: Car[] = [];
            for (const carData of data) {
              car.push(
                {
                  brand:"",
                  model: carData.type,
                  plate: carData.plate
                }
              )
            }
            setSavedCars(car);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        break;
      }
    }
  }, [baseUrl, setSavedCars]);
}