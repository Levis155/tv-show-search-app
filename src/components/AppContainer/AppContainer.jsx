import { FaRegStar, FaPlay, FaBookmark, FaSearch, FaRegCalendarAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { PiHeartStraightBold } from "react-icons/pi";
import { useState } from "react";
import "./AppContainer.css"
import PulseLoader from "react-spinners/PulseLoader";

function AppContainer() {
    const [showTyped, setShowTyped] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showData, setShowData] = useState(null);


    async function handleSearch(e) {
        e.preventDefault();

        try{
           setLoading(true);
           setError(false);
           setShowData(null);

           const response = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${showTyped}`);
           const data = await response.json();

           if(!response.ok) {
            throw new Error("There was an error")
           }

           setShowData(data);
           console.log(data);
        } catch{
            setError("could not find your show")
        }finally{
            setLoading(false)
        }
    }



  return (


    <div className="app-container">
      <form action="" className="form-container">
        <input type="text" placeholder="search for a tV series" value={showTyped} onChange={(e) => {setShowTyped(e.target.value)}} />
        <button onClick={handleSearch} disabled={loading}><FaSearch /></button>
      </form>

      {loading && <div className="loader-container"><PulseLoader size={30} color="#f5c417" /></div> }

      {error && <div className="error-container"><h1>{error}</h1></div>}

      {showData && !loading && !error && 
      <div className="show-card-container">
        <ShowCard key={showData.id} showThumbnail={showData.image.original} showTitle={showData.name} rating={showData.rating.average } runtime={showData.runtime} weight={showData.weight} premiered={showData.premiered} ended={showData.ended} trailerLink={`https://www.google.com/search?q=${showData.name} trailer`} showData={showData} />
      </div>}
    </div>
  );
}

function ShowCard({ showThumbnail, showTitle, rating, runtime, weight, premiered, ended, trailerLink, showData}) {
  let premieredYear = "";
  let endedYear = "";

  const premieredCharacters = premiered.split('');
  const premieredFirstFourCharacters = premieredCharacters.slice(0, 4);

  for(let i = 0; i<premieredFirstFourCharacters.length; i++) {
    premieredYear += premieredFirstFourCharacters[i];
  }
    
  if (ended) {

      const endedCharacters = ended.split('');
      const endedFirstFourCharacters = endedCharacters.slice(0, 4);

      for(let i = 0; i<endedFirstFourCharacters.length; i++) {
        endedYear += endedFirstFourCharacters[i];
      }
    } else{
      endedYear = "present";
    }







    const parser = new DOMParser();
    const doc = parser.parseFromString(showData.summary, 'text/html');
    const cleanSummary = doc.body.textContent || '';

    if (!runtime) {
      runtime = "--"
    }

    if (!rating) {
      rating = "unrated"
    }

    return(
        <div className="show-card">
        <div className="show-card-left">
            <img src={showThumbnail} alt="" />
        </div>

        <div className="show-card-right">
          <h1 className="show-title">{showTitle}</h1>
          <div className="genres-container">
            {
                showData.genres.map((genre) => <p key={Math.random()} className="genre">{genre}</p>)
            }
          </div>
          <div className="show-details-container">
            <div className="detail-container">
            <FaRegStar />
              <p>imdb: {rating}</p>
            </div>

            <div className="detail-container">
            <FaRegClock />
              <p className="run-time">{runtime} minutes</p>
            </div>

            <div className="detail-container">
            <PiHeartStraightBold />
              <p className="hearts">{weight}%</p>
            </div>

            <div className="detail-container">
            <FaRegCalendarAlt />
              <p>{premieredYear} - {endedYear}</p>
            </div>
          </div>

          <p className="show-excerpt">
            {cleanSummary}
          </p>

          <div className="links-container">
            <a href={trailerLink} target="_blank" className="watch-trailer-link"><FaPlay />watch trailer</a>
            <a href="#" className="save-later-link"><FaBookmark />save for later</a>
          </div>
        </div>
      </div>
    )
}

export default AppContainer;
