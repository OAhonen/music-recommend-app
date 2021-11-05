import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import Recommendations from "./Recommendations";
import './css/search.css'

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
  const [faultSearch, setFaultSearch] = useState(false);
  let search = "";
  let artistAnswerChoices = "";
  let trackAnswerChoices = "";
  let badSearch = <p>Give proper search value.</p>
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  console.log('search');
  console.log(accessToken)

  const handleSearchArtistText = (event) => {
    setSearchArtistText(event.target.value);
  }

  const handleSearchTrackText = (event) => {
    setSearchTrackText(event.target.value);
  }

  const searchArtistClicked = async (event) => {
    event.preventDefault();
    isLoading(true);

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchArtistText}&type=artist&limit=5`, authOptions)
      const json = await response.json()
      setSearchArtistResult(json.artists.items);
      isLoading(false);
      setFaultSearch(false);
      console.log(json.artists.items);
    } catch (error) {
        console.log('error', error)
        setFaultSearch(true);
        isLoading(false);
        setSearchArtistResult([]);
        setSearchTrackResult([]);
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
      setFaultSearch(false);
      console.log(json.tracks.items);
    } catch (error) {
        console.log('error', error)
        setFaultSearch(true);
        isLoading(false);
        setSearchArtistResult([]);
        setSearchTrackResult([]);
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
      <Recommendations artistInfo={selectedArtist} trackInfo={selectedTrack} accessToken={accessToken}></Recommendations>
    )
  }

  if (itemChosen) {
    console.log('hello')
    search = <div className="searchButton"><br/>
              <Button variant="contained" size="large" key="recom" onClick={getRecommendations}>
                Get recommendations
              </Button>
              </div>
  }

  if (searchArtistResult.length !== 0) {
    artistAnswerChoices = 
    <div className="artistChoices">
      Select artist<br/>
      <ul>
        {searchArtistResult.map((result) => 
          <li key={result.href} id={searchArtistResult.indexOf(result)}
            onClick={artistClicked}>{result.name}
          </li>
        )}
      </ul>
    </div>
  }

  if (searchTrackResult.length !== 0) {
    trackAnswerChoices = 
    <div className="trackChoices">
      Select track<br/>
      <ul>
        {searchTrackResult.map((result) =>
          <li key={result.href} id={searchTrackResult.indexOf(result)}
            onClick={trackClicked}>{result.artists[0].name} - {result.name}
          </li>
        )}
      </ul>
    </div>
  }

  return (
    <div className="formArea">
      <form className="askArtist">
        <label>
          Artist:&nbsp;
          <input type="text"
            className="input"
            name="artist"
            value={searchArtistText}
            pattern = "^[A-Za-z0-9]+$"
            onChange={handleSearchArtistText}/>
        </label>&nbsp;
        <input className="submit" type="submit" value="Search" onClick={searchArtistClicked}/><br/>
      </form>
      <form className="askTrack">
        <label>
          Track:&nbsp;
          <input type="text"
            className="input"
            name="track"
            value={searchTrackText}
            pattern = "^[A-Za-z0-9]+$"
            onChange={handleSearchTrackText}/>
        </label>&nbsp;
        <input className="submit" type="submit" value="Search" onClick={searchTrackClicked}/><br/>
      </form>
      {loading && <CircularProgress/>}
      {searchArtistResult.length !== 0 && <p>{artistAnswerChoices}</p>}
      {searchTrackResult.length !== 0 && <p>{trackAnswerChoices}</p>}

      {selectedArtist[0] !== undefined &&
      <div className="artistsSelectedText">
      Artists selected
      <ul className="wholeChosenList">
      {selectedArtist.map((artist) => 
        <li className="chosenList" key={artist.href}>
          {artist.name + " "}
        </li>)}
      </ul>
      </div>}

      {selectedTrack[0] !== undefined &&
      <div className="tracksSelectedText">
      Tracks selected
      <ul className="wholeChosenList">
      {selectedTrack.map((track) => 
        <li className="chosenList" key={track.href}>
          {track.artists[0].name + " - " + track.name + " "}
        </li>)}
      </ul>
      </div>}

      {itemChosen && search}
      {faultSearch && !loading && badSearch}
    </div>
  )
}

export default Search;