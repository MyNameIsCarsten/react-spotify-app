
import styles from './Track.module.css'

const Track = ({ data, addToPlaylist, removeFromPlaylist, origin }) => {

  const artistArray = (data) => {
    return data.map(artist => artist.name);
}
  const artists = artistArray(data.artists).join(', ')


    
    const clickHandler = () => {
        console.log(origin)
        if (origin === 'tracklist') {
            addToPlaylist(data);
        } else {
            removeFromPlaylist(data.id);
        }
        
    }

  return (
      <div key={data.id} className={styles.track}>
          <div className={styles.trackinfo}>
            <h4>{data.name}</h4>
            <p>{artists}</p>
            <p>{data.uri.split('spotify:track:')}</p>
          </div>
          <button onClick={clickHandler}>{origin === 'tracklist' ? '+' : '-'}</button>
          
    </div>

  )
}

export default Track;