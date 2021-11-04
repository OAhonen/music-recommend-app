import './App.css';
import { useEffect, useState } from 'react';
import Search from './Search';
import { Credentials } from './Credentials';

function App() {
  const spotify = Credentials();
  const [accessToken, setAccessToken] = useState('');
  let authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify.ClientId + ':' + spotify.ClientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions)
        const json = await response.json()
        console.log(json);
        setAccessToken(json.access_token);
      } catch (error) {
          console.log('error', error)
      }
    }

    fetchToken();
  }, [])

  return (
    <div>
      <Search accessToken={accessToken}></Search>
    </div>
  );
}

export default App;
