import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import Recommendations from "./Recommendations";

function Search(props) {
  let accessToken = props.accessToken;
  const [searchArtistText, setSearchArtistText] = useState("");
  const [searchArtistResult, setSearchArtistResult] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([]);
  const [searchTrackText, setSearchTrackText] = useState("");
  const [searchTrackResult, setSearchTrackResult] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState([]);
  const [itemChosen, setItemChosen] = useState(false);
  const [recommendationsClicked, setRecommendationsClicked] = useState(false);
  const [loading, isLoading] = useState(false);
  let search = "";
  let artistAnswerChoices = "";
  let trackAnswerChoices = "";
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  console.log('search');

  const handleSearchArtistText = (event) => {
    setSearchArtistText(event.target.value);
  }

  const handleSearchTrackText = (event) => {
    setSearchTrackText(event.target.value);
  }

  const searchArtistClicked = async (event) => {
    event.preventDefault();
    console.log(searchArtistText.length)
    isLoading(true);

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchArtistText}&type=artist&limit=5`, authOptions)
      const json = await response.json()
      setSearchArtistResult(json.artists.items);
      isLoading(false);
      console.log(json.artists.items);
    } catch (error) {
        console.log('error', error)
    }
  }

  const searchTrackClicked = async (event) => {
    event.preventDefault();
    isLoading(true);

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTrackText}&type=track&limit=5`, authOptions)
      const json = await response.json()
      setSearchTrackResult(json.tracks.items);
      isLoading(false);
      console.log(json.tracks.items);
    } catch (error) {
        console.log('error', error)
    }
  }

  const artistClicked = (event) => {
    event.preventDefault();
    setSelectedArtist(prevArray => [...prevArray, searchArtistResult[event.target.id]]);
    console.log(selectedArtist)
    setItemChosen(true);
    setSearchArtistResult([]);
  }

  const trackClicked = (event) => {
    event.preventDefault();
    setSelectedTrack(prevArray => [...prevArray, searchTrackResult[event.target.id]]);
    console.log(selectedTrack);
    setItemChosen(true);
    setSearchTrackResult([]);
  }

  const getRecommendations = (event) => {
    console.log('???')
    event.preventDefault();
    setRecommendationsClicked(true);
  }

  if (recommendationsClicked) {
    return (
      <Recommendations searchInfo={selectedArtist} accessToken={accessToken}></Recommendations>
    )
  }

  if (itemChosen) {
    console.log('hello')
    search = <Button variant="contained" key="recom" onClick={getRecommendations}>Get recommendations</Button>
  }

  if (searchArtistResult.length !== 0) {
    artistAnswerChoices = searchArtistResult.map((result) => 
      <Button variant="contained" key={result.href} id={searchArtistResult.indexOf(result)}
        onClick={artistClicked}>{result.name}
      </Button>
    )
  }

  if (searchTrackResult.length !== 0) {
    trackAnswerChoices = searchTrackResult.map((result) =>
    <Button variant="contained" key={result.href} id={searchTrackResult.indexOf(result)}
      onClick={trackClicked}>{result.artists[0].name} - {result.name}
    </Button>
    )
  }

  return (
    <div>
      <form>
        <label>
          Search artist:
          <input type="text" name="artist" value={searchArtistText} onChange={handleSearchArtistText}/>
        </label>
        <input type="submit" value="Submit" onClick={searchArtistClicked}/><br/>
        <label>
          Search track:
          <input type="text" name="track" value={searchTrackText} onChange={handleSearchTrackText}/>
        </label>
        <input type="submit" value="Submit" onClick={searchTrackClicked}/><br/>
      </form>
      {loading
      ?
      <CircularProgress/>
      :
      searchArtistResult.length !== 0
      ?
      <p>{artistAnswerChoices}</p>
      :
      searchTrackResult.length !== 0
      ?
      <p>{trackAnswerChoices}</p>
      :
      null}<br/>
      Artists selected: {selectedArtist[0] !== undefined && selectedArtist.map((artist) => artist.name + " ")}<br/>
      Track selected: {selectedTrack[0] !== undefined && selectedTrack.map((track) => track.name + " ")}<br/>
      {itemChosen === true && search}
    </div>
  )
}

export default Search;