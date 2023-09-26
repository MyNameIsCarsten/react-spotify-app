
import styles from './Track.module.css'

const Track = ({ data, addToPlaylist, removeFromPlaylist, origin }) => {

  // Define variables for displaying artists
  // Create artist array if there is data
  const artistArray = data?.artists?.map((artist) => artist.name) || [];
  // Concatenate artists, seperated by a comma
  const artists = artistArray.join(', ');

  // click handler for adding or removing track from playlist
  const clickHandler = () => {
      if (origin === 'tracklist') {
          addToPlaylist(data);
      } else {
          removeFromPlaylist(data.id); // origin === 'playlist'
      }
  }

  return (
      <div key={data.id} className={styles.track}>
      <div className={styles.info}>
        <img src={data.album.images[2].url} alt={data.name}/>
        <div className={styles.trackinfo}>
          <h4>{data.name}</h4>
          <p>{artists}</p>
        </div>
            
          </div>
          <button onClick={clickHandler}>{origin === 'tracklist' ? '+' : '-'}</button>
          
    </div>
  )
}

export default Track;
