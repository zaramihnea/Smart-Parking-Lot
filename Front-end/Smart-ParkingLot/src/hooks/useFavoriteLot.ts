import { useCallback } from "react";
import Cookies from "js-cookie";

export default function useFavoriteLot() {
  const getFavoriteLot = useCallback((baseUrl: string): Promise<number> => {
    const token = Cookies.get("authToken");

    const id = - 1;
    if (!token) {
      return Promise.resolve(type);
    }

    return fetch(`${baseUrl}/user/favorite-lot`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const longId = parseLong(data, 10); // Parse the response as an integer
      if (isNaN(longId)) {
        throw new Error('Invalid id received');
      }
      return longId;
    })
    .catch(error => {
      console.error('Error:', error);
      return id; // Return default type in case of error
    });
  }, []);

  return { getFavoriteLot };
}
