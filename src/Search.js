import { Button } from "@mui/material";
import { useState } from "react";
import Recommendations from "./Recommendations";

function Search(props) {
  let accessToken = props.accessToken;
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState({});
  const [artistChosen, setArtistChosen] = useState(false);
  const [recommendationsClicked, setRecommendationsClicked] = useState(false);
  let search = "";
  let answerChoices = "";
  console.log('search');

  const handleSearchText = (event) => {
    setSearchText(event.target.value)
  }

  const searchClicked = async (event) => {
    event.preventDefault();

    let authOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchText}&type=artist&limit=5`, authOptions)
      const json = await response.json()
      setSearchResult(json.artists.items);
      console.log(json.artists.items);
    } catch (error) {
        console.log('error', error)
    }
  }

  const artistClicked = (event) => {
    event.preventDefault();
    setSelectedArtist(searchResult[event.target.id]);
    console.log(selectedArtist)
    setArtistChosen(true);
    setSearchResult([]);
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

  if (artistChosen) {
    console.log('hello')
    search = <Button variant="contained" key="recom" onClick={getRecommendations}>Get recommendations</Button>
  }

  if (searchResult.length !== 0) {
    answerChoices = searchResult.map((result) => 
      <Button variant="contained" key={result.href} id={searchResult.indexOf(result)}
        onClick={artistClicked}>{result.name}
      </Button>
    )
  }

  return (
    <div>
      <form>
        <label>
          Search artist:
          <input type="text" name="name" value={searchText} onChange={handleSearchText}/>
        </label>
        <input type="submit" value="Submit" onClick={searchClicked}/>
      </form>
      {searchResult.length !== 0 && answerChoices}<br/>
      Artists selected: {selectedArtist.name}<br/>
      {artistChosen === true && search}
    </div>
  )
}

export default Search;