import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

function Recommendations(props) {
  let accessToken = props.accessToken;
  let searchInfo = props.searchInfo;
  const [searchResult, setSearchResult] = useState([]);
  const [loading, isLoading] = useState(true);
  let url = [];
  let finalUrl = "";
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  searchInfo.forEach(e => {
    url.push(e.uri.slice(15, e.uri.length))
  });

  for (let i = 0; i < url.length; i++) {
    finalUrl = finalUrl + url[i];
    if (i !== url.length-1) {
      finalUrl = finalUrl + ",";
    }
  }

  useEffect(() => {
    const getRecommendations= async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_artists=${finalUrl}`, authOptions)
        const json = await response.json()
        console.log(json.tracks);
        setSearchResult(json.tracks);
        isLoading(false);
      } catch (error) {
          console.log('error', error)
      }
    }

    getRecommendations();
  }, [])

  return (
    <div>
      {loading
      ?
      <CircularProgress/>
      :
      searchResult.length !== 0
      ?
      searchResult.map((track) =>
      <p key={track.name}>{track.artists[0].name} - {track.name}</p>)
      :
      <p>Recommendations not found.</p>}
    </div>
  )
}

export default Recommendations;