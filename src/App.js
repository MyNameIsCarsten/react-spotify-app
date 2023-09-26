
import './App.css';
import SearchBar from './components/SearchBar';
import Playlist from './components/Playlist';
import Tracklist from './components/Tracklist';
import { useState, useEffect } from 'react';
import background from './assets/background.jpg'


function App() {
  // define states
  const [tracklist, setTracklist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [token, setToken] = useState("")

  // on mount: grab token stored in local storage
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    } 
    setToken(token)

  }, [])
  
  // function to update tracklist, will be called by SearchBar.js after getting results
  const updateTracklist = (array) => {
    setTracklist(array);
  }

  // function to add tracks to playlist, will be called from Track.js
  const addToPlaylist = (newTrack) => {
    // check if newTrack is already in playlist
    if (playlist.some((t) => t.id === newTrack.id)) {
    } else {
      setPlaylist((prev) => [...prev, newTrack]); // if not, it will be added
    }
    
  };

  // function to remove tracks from playlist, will be called from Track.js
  const removeFromPlaylist = (trackId) => {
    setPlaylist((prev) => prev.filter(n => n.id !== trackId));
  };

  // function to get user data
  const currentUser = () => {
    return fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(userData => {
      return userData; // this can be checked for the scope
    });
  }

  
  // Function to create a playlist (assuming you have the user's ID)
  const createPlaylist = (userId, playlistName, token) => {
    let playlistId; // initialize variable to store playlist id

    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName,
        description: "New playlist created by app",
        public: false
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error in createPlaylist. Network response was not ok');
      }
      return response.json();
    })
    .then(jsonResponse => {
      playlistId = jsonResponse.id; // Store the playlistId
      let uriArray = playlist.map(track => track.uri); // create uriArray based on tracks in playlist
      
      // Add tracks to the newly created playlist
      return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          uris: uriArray, //array of uris created above
          position: 0, 
        })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error in adding tracks to the playlist. Network response was not ok');
      }

      setPlaylist([]); // reset playlist after successfull playlist creation
      setPlaylistName(''); // reset playlistName after successfull playlist creation

      alert(`Your playlist ${playlistName} was successfully created!`); // notify user of successfull playlist creation
      return response.json();
    });
  }

  return (
    <div className="App" style={{backgroundImage: `url(${background})`, minHeight: '100vh'}}>
      <div className="title">
              <h1>Ja<span>mmm</span>ing</h1>
        </div>
      <SearchBar token={token} updateTracklist={updateTracklist}/>
      <div className='flex'>
        <Tracklist data={tracklist} addToPlaylist={addToPlaylist}/>
        <Playlist
          className='flexItem'
          playlist={playlist}
          data={tracklist}
          removeFromPlaylist={removeFromPlaylist}
          setPlaylistName={setPlaylistName}
          playlistName={playlistName}
          currentUser={currentUser}
          createPlaylist={createPlaylist}
          token={token}/>
      </div>
      
    </div>
  );
}

export default App;
