import './App.css';
import { useEffect, useState } from 'react';
import Search from './Search';
import { Credentials } from './Credentials';
import Cookies from 'universal-cookie/es6';

function App() {
  const spotify = Credentials();
  let cookies = new Cookies();
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
    if (cookies.get('accessToken') === undefined) {
      const fetchToken = async () => {
        try {
          const response = await fetch('https://accounts.spotify.com/api/token', authOptions)
          const json = await response.json()
          console.log(json);
          cookies.set('accessToken', json.access_token, {path: '/', maxAge: 3500});
          setAccessToken(json.access_token);
        } catch (error) {
            console.log('error', error)
        }
      }

      fetchToken();
    } else {
      setAccessToken(cookies.get('accessToken'));
    }
  }, [])

  return (
    <div>
      <Search accessToken={accessToken}></Search>
    </div>
  );
}

export default App;
