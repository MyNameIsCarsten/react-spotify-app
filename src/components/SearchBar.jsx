import { useState } from "react";
import styles from './SearchBar.module.css'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const token = { "value": "BQAegj53JsF0Po8PSuDBrSo7FwQ9ViK624oATx6jWzdbon5eYGisqiQK1G2V46x2nWVW2I-MCnK1aoXysNFAGuWCIRWR5Hjldtw2iiSJEIhiaMYusxawUBGnxOhHSMaKTr9_JbKblBx_m5PpmaKJ245YR-Iz3kCmkC6Ixx2YVIkmgMy0bT7dh7mpFwnMdY2jkwM" };

    const submitHandler = (e) => {
        e.preventDefault();
    }

  return (
      <div className={styles.searchBar}>
          <form onSubmit={submitHandler}>
              <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} name='searchTerm' />
              <button type="submit">SEARCH</button>
          </form>
          
    </div>
  )
}

export default SearchBar;
