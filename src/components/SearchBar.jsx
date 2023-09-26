import { useState } from "react";
import styles from './SearchBar.module.css'

const CLIENT_ID = "76c2e93ccff64a5bb352a61a14093518"
const REDIRECT_URI = "http://localhost:3000/"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const SearchBar = ({ token, updateTracklist }) => {
    const [searchTerm, setSearchTerm] = useState('');

    console.log(token);

    const submitHandler = (e) => {
        e.preventDefault();

        console.log("Bearer Token:", token.value);
    

    const apiData = fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchTerm,
            type: "artist"
        }})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            // Now you can work with the JSON data
            // console.log(data);
    
            // Example: Accessing tracks
            const tracks = data.tracks.items;
            console.log('Tracks:', tracks);

            tracks.map(t => console.log(t.id))
            tracks.map(t => console.log(t.name))
            tracks.map(t => console.log(t.artist))

            updateTracklist(data.tracks);
    
            // Example: Accessing the first track name
            // if (tracks.length > 0) {
            //     const firstTrackName = tracks[0].name;
            //     console.log('First Track Name:', firstTrackName);
            // }
    
            // Return the data if needed
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    
    

  return (
      <div className={styles.searchBar}>
          <form onSubmit={submitHandler}>
              <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} name='searchTerm' />
              
              {token === null ? <button>
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
              </button> : <button type="submit">SEARCH</button>}
              
              
          </form>
          
    </div>
  )
}

export default SearchBar;
