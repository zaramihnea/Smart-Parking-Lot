import { useCallback } from "react";
import Cookies from "js-cookie";

export default function useUserType() {
  const getUserType = useCallback((baseUrl: string): Promise<number> => {
    const token = Cookies.get("authToken");

    const type = 1; // Default type as an integer
    if (!token) {
      return Promise.resolve(type);
    }

    return fetch(`${baseUrl}/user/type`, {
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
      const intType = parseInt(data, 10); // Parse the response as an integer
      if (isNaN(intType)) {
        throw new Error('Invalid type received');
      }
      return intType;
    })
    .catch(error => {
      console.error('Error:', error);
      return type; // Return default type in case of error
    });
  }, []);

  return { getUserType };
}
