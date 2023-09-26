import { useState } from "react";
import styles from './SearchBar.module.css'

const SearchBar = ({ token, updateTracklist }) => {
    // Define states
    const [searchTerm, setSearchTerm] = useState('');

    // Define variables for authentification
    const CLIENT_ID = `${process.env.REACT_APP_CLIENT_ID}`
    const REDIRECT_URI = "http://localhost:3000/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "playlist-modify-private playlist-modify-public";

    // submit handler
    const submitHandler = async (e) => {
        // prevent reload after submission
        e.preventDefault();

        // get search results from API
        try {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
                {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );
        
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
      
            // grab data from response
            const data = await response.json();

            // grab tracks from data
            const tracks = data.tracks.items;

            // update tracklist with tracks from API request
            updateTracklist(tracks);

        // catch error
        } catch (error) {
          console.error("Error (SearchBar):", error);
        }
      };
      

  return (
      <div className={styles.searchBar}>
            {!token ? (
              <button>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
              </button>)
              :
              (
                <form onSubmit={submitHandler}>
                    <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} name='searchTerm' />
                    <button type="submit">SEARCH</button>
                </form>
            )} 
    </div>
  )
}

export default SearchBar;
