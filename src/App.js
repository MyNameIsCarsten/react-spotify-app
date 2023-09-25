
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Tracklist from './components/Tracklist';
import Track from './components/Track';
import { useState, useEffect } from 'react';
import background from './assets/background.jpg'

const spotifyDataMock = [
  {
    id: 0,
    name: 'March Madness',
    artist: 'Future',
    album: '56 Nights',
    uri: '3WcC6NH9J77xPEvj1SOL7z',
  },
  {
    id: 1,
    name: 'April Anger',
    artist: 'Future',
    album: '56 Nights',
    uri: 'NOT3WcC6NH9J77xPEvj1SOL7z',
  },

]





function App() {
  const [tracklist, setTracklist] = useState(spotifyDataMock);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [token, setToken] = useState("")

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
  
  const updateTracklist = (array) => {
    setTracklist(array);
  }

  const addToPlaylist = (newTrack) => {
    if (playlist.some((t) => t.id === newTrack.id)) {
      console.log('Already in Playlist')
    } else {
      setPlaylist((prev) => [...prev, newTrack]);
    }
    
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist((prev) => prev.filter(n => n.id !== trackId));
  };

  return (
    <div className="App" style={{backgroundImage: `url(${background})`, minHeight: '100vh'}}>
      <div className="title">
              <h1>Ja<span>mmm</span>ing</h1>
        </div>
      <SearchBar token={token} updateTracklist={updateTracklist}/>
      <div className='flex'>
        <Tracklist data={tracklist} addToPlaylist={addToPlaylist}/>
        <Playlist className='flexItem' playlist={playlist}  data={tracklist} removeFromPlaylist={removeFromPlaylist} setPlaylistName={setPlaylistName} playlistName={playlistName}/>
      </div>
      
    </div>
  );
}

export default App;
