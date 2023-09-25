import styles from './Playlist.module.css'
import { useEffect, useState } from "react";
import Track from './Track';


const CLIENT_ID = "76c2e93ccff64a5bb352a61a14093518"
const REDIRECT_URI = "http://localhost:3000/"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const Playlist = ({ playlist, removeFromPlaylist, setPlaylistName, playlistName }) => {


    const clickHandler = () => {
      playlist.map((song) => console.log(song.uri))
  }
  
  
  return (
    <div className={styles.playlist}>
      <form className={styles.form}>
          <input onChange={(e) => setPlaylistName(e.target.value)} value={playlistName} name='playlist' placeholder='Enter playlist name'/>
      </form>
      {playlist.map((song, index) => <Track key={song.id} data={song} removeFromPlaylist={removeFromPlaylist}  origin='playlist'/>)}
      <button type="submit" onClick={clickHandler}>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Save to Spotify</a>
      </button>
    </div>
  )
}

export default Playlist
