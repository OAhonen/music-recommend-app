import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import './css/recommendations.css'

function Recommendations(props) {
  let accessToken = props.accessToken;
  let artistInfo = props.artistInfo;
  let trackInfo = props.trackInfo;
  const [searchResult, setSearchResult] = useState([]);
  const [loading, isLoading] = useState(true);
  let artistFinalUrl = "";
  let trackFinalUrl = "";
  let finalUrl = "https://api.spotify.com/v1/recommendations?limit=20";
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
        if (response.ok) {
          const json = await response.json()
          console.log(json.tracks);
          setSearchResult(json.tracks);
        }
        isLoading(false);
      } catch (error) {
          console.log('error', error)
      }
    }

    getRecommendations();
  }, [])

  return (
    <div className="resultArea">
      <Button onClick={() => window.location.reload()}>Back to search</Button>
      {loading
      ?
      <CircularProgress/>
      :
      searchResult.length !== 0
      ?
      <table>
        <tbody>
        <tr>
          <th>Artist</th>
          <th>Track</th>
          <th>Preview (if available)</th>
        </tr>
      {searchResult.map((track) =>
        <tr key={track.id}>
          <td key={track.artists[0].name}>{track.artists[0].name}</td>
          <td key={track.name}>{track.name}</td>
          <td key={track.popularity}>
            {track.preview_url !== null
            ?
              <video controls name="media" height="25" width="300">
                <source src={track.preview_url} type="audio/mpeg"/>
              </video>
            :
                null}
          </td>
        </tr>)}
      </tbody>
      </table>
      :
      <p>Recommendations not found.</p>}
    </div>
  )
}

export default Recommendations;