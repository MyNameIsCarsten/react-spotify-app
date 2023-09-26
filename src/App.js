
import './App.css';
import SearchBar from './components/searchbar/SearchBar';
import Playlist from './components/playlist/Playlist';
import Tracklist from './components/tracklist/Tracklist';
import { useState, useEffect } from 'react';


function App() {
  // define states
  const [tracklist, setTracklist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null); // Initialize with null or an empty object
  


  // on mount: grab token stored in local storage
  useEffect(() => {
    // retrieves the current URL hash portion
    const hash = window.location.hash
    // attempts to retrieve a token from the browser's local storage
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
  const currentUser = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.reload(); 
        throw new Error('Network response was not ok');
      }
  
      const userData = await response.json();
      return userData; 

    } catch (error) {
      throw error; 
    }
  }

  // update the user state
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await currentUser();
          setUser(userData);
        } catch (error) {
          // Handle any errors if necessary
          console.error('Error fetching user data:', error);
        }
      };

      if (token) {
        fetchUserData();
      }
    }, [token]);
  
 
  // Function to create a playlist (assuming you have the user's ID)
  const createPlaylist = async (userId, playlistName, token) => {
    try {
      let playlistId; // initialize variable to store playlist id
  
      // Create the playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
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
      });
  
      if (!createResponse.ok) {
        throw new Error('Error in createPlaylist. Network response was not ok');
      }
  
      const createJsonResponse = await createResponse.json();
      playlistId = createJsonResponse.id; // Store the playlistId
  
      let uriArray = playlist.map(track => track.uri); // create uriArray based on tracks in playlist
  
      // Add tracks to the newly created playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: uriArray, // array of uris created above
          position: 0,
        })
      });
  
      if (!addTracksResponse.ok) {
        throw new Error('Error in adding tracks to the playlist. Network response was not ok');
      }
  
      setPlaylist([]); // reset playlist after successful playlist creation
      setPlaylistName(''); // reset playlistName after successful playlist creation
  
      alert(`Your playlist ${playlistName} was successfully created!`); // notify the user of successful playlist creation
  
      return addTracksResponse.json();
    } catch (error) {
      throw error; // Handle or rethrow the error as needed
    }
  }

  // Logout function
  const userProfileClickHandler = () => {
    localStorage.removeItem("token");
    window.location.reload();   
  }

  const saveTrack = async (trackId) => {
    
    let curToken = token;
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${curToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: [
            trackId,
          ],
        })
      });
      if (!response.ok) {
        throw new Error('Error saving track');
      }

    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="App" style={{minHeight: '100vh'}}>
      <div className="title">
        <h1>Spot<span>API</span>fy</h1>
        <div className='userInfo'>
          
          {user ? <button onClick={userProfileClickHandler}><img alt={user.display_name} src={user.images[0].url} /></button> : ''}
          <button onClick={userProfileClickHandler}><b>{user ? user.display_name : ''}</b></button>
        </div>
      </div>
      <SearchBar token={token} updateTracklist={updateTracklist} />
      {token ? (
        <div className='flex'>
          <Tracklist data={tracklist} addToPlaylist={addToPlaylist} saveTrack={saveTrack} />
          <Playlist
            className='flexItem'
            playlist={playlist}
            data={tracklist}
            removeFromPlaylist={removeFromPlaylist}
            setPlaylistName={setPlaylistName}
            playlistName={playlistName}
            currentUser={currentUser}
            createPlaylist={createPlaylist}
            token={token} />
        </div>
      )
        :
        ''
      }
      
    </div>
  );
}

export default App;
