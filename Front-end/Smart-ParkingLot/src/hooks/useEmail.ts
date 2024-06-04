import { useCallback } from "react";

export default function useEmail() {
  const getEmail = useCallback((baseUrl: string): Promise<string> => {
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    let userEmail = "user@example.com"; // Email-ul implicit pentru utilizatorul care nu este autentificat
    let authToken = "";

    for (const cookie of cookies) {
      if (cookie[0] && cookie[0].includes('authToken')) {
        authToken = cookie[1];
      }
    }

    if(!authToken) {
      return Promise.resolve(userEmail);
    }

    return fetch(`${baseUrl}/user/email`, {
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
      return userEmail;
    });
  }, []);

  return { getEmail };
}