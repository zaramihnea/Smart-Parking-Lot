import { useCallback } from "react";

export default function useUsername() {
  const getUsername = useCallback((baseUrl: string): Promise<string> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    let authToken = "";
    for (const cookie of cookies) {
      if (cookie[0] && cookie[0].includes('authToken')) {
        authToken = cookie[1];
      }
    }
    
    const username = "user that is not logged in";
    if(!authToken) {
      return Promise.resolve(username);
    }

    return fetch(`${baseUrl}/user/username`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      return username;
    });
  }, []);

  return { getUsername };
}