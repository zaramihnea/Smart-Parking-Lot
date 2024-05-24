import { useEffect } from "react";

export default function useUsername(baseUrl : string, setUsername :React.Dispatch<React.SetStateAction<string>>) {
  useEffect(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    let username = "user that is not logged in";
    let authToken = "";
    for (const cookie of cookies) {
      if (cookie[0] && cookie[0].includes('authToken')) {
        authToken = cookie[1];
      }
    }
    if (authToken) {
      fetch(`${baseUrl}/user/username`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      .then(response => {
        if(response.status !== 200) {
          return;
        }
        else {
          return response.text();
        }
      })
      .then(data => {
        console.log(data);
        username = data || "user that is not logged in";
        setUsername(username);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    else {
      setUsername(username);
    }

  }, [baseUrl, setUsername]);
}