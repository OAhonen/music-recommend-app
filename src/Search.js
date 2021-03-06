import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import Recommendations from "./Recommendations";
import './css/search.css'
import Header from "./Header";

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
  let badSearch = <div className="askArtist">Give proper search value.<br/><br/></div>
  let authOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const handleSearchArtistText = (event) => {
    setSearchArtistText(event.target.value);
  }

  const handleSearchTrackText = (event) => {
    setSearchTrackText(event.target.value);
  }

  /**
   * Called when user clicks search-button for artists.
   * @param {} event 
   */
  const searchArtistClicked = async (event) => {
    event.preventDefault();
    isLoading(true);
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchArtistText}&type=artist&limit=10`, authOptions)
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

  /**
   * Called when user clicks search-button for tracks.
   * @param {} event 
   */
  const searchTrackClicked = async (event) => {
    event.preventDefault();
    isLoading(true);
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTrackText}&type=track&limit=10`, authOptions)
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

  /**
   * User clicks artist from the list.
   * @param {} event 
   */
  const artistClicked = (event) => {
    event.preventDefault();
    if (selectedArtist.length < 5) {
      setSelectedArtist(prevArray => [...prevArray, searchArtistResult[event.target.id]]);
      console.log(selectedArtist)
      setItemChosen(true);
      let tempArray = [...searchArtistResult];
      tempArray.splice(event.target.id, 1);
      setSearchArtistResult(tempArray);
    }
    //setSearchArtistResult([]);
    //setSearchArtistText("")
  }

  /**
   * User clicks track from the list.
   * @param {} event 
   */
  const trackClicked = (event) => {
    event.preventDefault();
    if (selectedTrack.length < 5) {
      setSelectedTrack(prevArray => [...prevArray, searchTrackResult[event.target.id]]);
      console.log(selectedTrack);
      setItemChosen(true);
      let tempArray = [...searchTrackResult];
      tempArray.splice(event.target.id, 1);
      setSearchTrackResult(tempArray);
    }
    //setSearchTrackResult([]);
    //setSearchTrackText("");
  }

  /**
   * User clicks get recommendations -button.
   * @param {*} event 
   */
  const getRecommendations = (event) => {
    event.preventDefault();
    setRecommendationsClicked(true);
  }

  /**
   * Remove artist.
   * @param {} event 
   */
  const removeArtist = (event) => {
    event.preventDefault();
    let tempArray = [...selectedArtist];
    tempArray.splice(event.target.id, 1);
    setSelectedArtist(tempArray);
    if (tempArray.length === 0 && selectedTrack.length === 0) {
      setItemChosen(false);
    }
  }

  /**
   * Remove track.
   * @param {} event 
   */
  const removeTrack = (event) => {
    event.preventDefault();
    let tempArray = [...selectedTrack];
    tempArray.splice(event.target.id, 1);
    setSelectedTrack(tempArray);
    if (tempArray.length === 0 && selectedArtist.length === 0) {
      setItemChosen(false);
    }
  }

  if (recommendationsClicked) {
    return (
      <Recommendations artistInfo={selectedArtist} trackInfo={selectedTrack} accessToken={accessToken}></Recommendations>
    )
  }

  /**
   * If any track/artist is selected, show the recommendations button.
   */
  if (itemChosen) {
    search = <div className="searchButton"><br/>
              <Button variant="contained" size="large" key="recom" onClick={getRecommendations}>
                Get recommendations
              </Button>
              </div>
  } else if (!itemChosen) {
    search = <div></div>
  }

  /**
   * Show the artists found from the fetch.
   */
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
      </ul><br/>
    </div>
  }

  /**
   * Show the tracks found from the fetch.
   */
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
      </ul><br/>
    </div>
  }

  return (
    <div className="formArea">
      <Header></Header>
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
      </form><br/>
      {loading && <CircularProgress/>}
      {faultSearch && !loading && badSearch}
      {searchArtistResult.length !== 0 && artistAnswerChoices}
      {searchTrackResult.length !== 0 && trackAnswerChoices}

      {selectedArtist[0] !== undefined &&
      <div className="artistsSelectedText">
      Artists selected
      <ul className="wholeChosenList">
      {selectedArtist.map((artist) => 
        <li className="chosenList" 
            id={selectedArtist.indexOf(artist)} 
            key={selectedArtist.indexOf(artist)} 
            onClick={removeArtist}>
          {artist.name + " "}
        </li>)}
      </ul><br/>
      </div>}

      {selectedTrack[0] !== undefined &&
      <div className="tracksSelectedText">
      Tracks selected
      <ul className="wholeChosenList">
      {selectedTrack.map((track) => 
        <li className="chosenList"
            id={selectedTrack.indexOf(track)}
            key={selectedTrack.indexOf(track)}
            onClick={removeTrack}>
          {track.artists[0].name + " - " + track.name + " "}
        </li>)}
      </ul><br/>
      </div>}

      {itemChosen && search}
    </div>
  )
}

export default Search;