import { useEffect, useState } from "react";

function Recommendations(props) {
  let accessToken = props.accessToken;
  let searchInfo = props.searchInfo;
  let url = searchInfo.uri.slice(15, searchInfo.uri.length)
  const [searchResult, setSearchResult] = useState([])
  console.log(url);
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  useEffect(() => {
    const getRecommendations= async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_artists=${url}`, authOptions)
        const json = await response.json()
        console.log(json.tracks);
        setSearchResult(json.tracks);
      } catch (error) {
          console.log('error', error)
      }
    }

    getRecommendations();
  }, [])

  return (
    <div>
      {searchResult.map((track) =>
      <p key={track.name}>{track.artists[0].name} - {track.name}</p>)}
    </div>
  )
}

export default Recommendations;