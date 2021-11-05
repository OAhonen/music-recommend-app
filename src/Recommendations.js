import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

function Recommendations(props) {
  let accessToken = props.accessToken;
  let artistInfo = props.artistInfo;
  let trackInfo = props.trackInfo;
  const [searchResult, setSearchResult] = useState([]);
  const [loading, isLoading] = useState(true);
  let artistFinalUrl = "";
  let trackFinalUrl = "";
  let finalUrl = "https://api.spotify.com/v1/recommendations?limit=5&";
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (artistInfo.length !== 0) {
    let artistUrl = [];
    artistInfo.forEach(e => {
      artistUrl.push(e.uri.slice(15, e.uri.length))
    });

    for (let i = 0; i < artistUrl.length; i++) {
      artistFinalUrl = artistFinalUrl + artistUrl[i];
      if (i !== artistUrl.length-1) {
        artistFinalUrl = artistFinalUrl + ",";
      }
    }
    artistFinalUrl = `seed_artists=${artistFinalUrl}`;
    finalUrl = `${finalUrl}&${artistFinalUrl}`;
  }

  if (trackInfo.length !== 0) {
    let trackUrl = [];
    trackInfo.forEach(e => {
      trackUrl.push(e.uri.slice(14, e.uri.length))
    });

    for (let i = 0; i < trackUrl.length; i++) {
      trackFinalUrl = trackFinalUrl + trackUrl[i];
      if (i !== trackUrl.length-1) {
        trackFinalUrl = trackFinalUrl + ",";
      }
    }
    trackFinalUrl = `seed_tracks=${trackFinalUrl}`;
    finalUrl = `${finalUrl}&${trackFinalUrl}`;
  }

  useEffect(() => {
    const getRecommendations= async () => {
      try {
        const response = await fetch(finalUrl, authOptions)
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
      <Button onClick={() => window.location.reload()}>Back to search</Button>
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