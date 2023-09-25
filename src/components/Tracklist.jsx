import Track from "./Track"
import styles from './Tracklist.module.css'

const Tracklist = ({ data, addToPlaylist }) => {
    console.log('Data: ', data.items)

    data = data.items;
    
  return (
    <div className={styles.tracklist} >
    <h2>Results</h2>

          {/* {data.map((track, index) => <Track key={track.id} data={data[index]} addToPlaylist={addToPlaylist} origin='tracklist'/>)} */}
          {data !== undefined ? data.map((track, index) => <Track key={track.id} data={data[index]} addToPlaylist={addToPlaylist} origin='tracklist'/>) : ''}

    
</div>
  )
}

export default Tracklist;


