import { FaRegStar, FaPlay, FaBookmark, FaSearch } from "react-icons/fa";
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
        <input type="text" placeholder="search for tV series" value={showTyped} onChange={(e) => {setShowTyped(e.target.value)}} />
        <button onClick={handleSearch} disabled={loading}><FaSearch /></button>
      </form>

      {loading && <div className="loader-container"><PulseLoader size={30} color="#f5c417" /></div> }

      {error && <div className="error-container"><h1>{error}</h1></div>}

      {showData && !loading && !error && 
      <div className="show-card-container">
        <ShowCard showThumbnail={showData.image.original} showTitle={showData.name} rating={showData.rating.average} runtime={showData.runtime} weight={showData.weight} showData={showData} />
      </div>}
    </div>
  );
}

function ShowCard({ showThumbnail, showTitle, rating, runtime, weight, showData}) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(showData.summary, 'text/html');
    const cleanSummary = doc.body.textContent || '';

    return(
        <div className="show-card">
        <div className="show-card-left">
            <img src={showThumbnail} alt="" />
        </div>

        <div className="show-card-right">
          <h1 className="show-title">{showTitle}</h1>
          <div className="genres-container">
            {
                showData.genres.map((genre) => <p className="genre">{genre}</p>)
            }
          </div>
          <div className="show-details-container">
            <div className="detail-container">
            <FaRegStar />
              <p>imdb: {rating} / 10</p>
            </div>

            <div className="detail-container">
            <FaRegClock />
              <p className="run-time">{runtime} minutes</p>
            </div>

            <div className="detail-container">
            <PiHeartStraightBold />
              <p className="hearts">{weight}% liked this</p>
            </div>
          </div>

          <p className="show-excerpt">
            {cleanSummary}
          </p>

          <div className="links-container">
            <a href="#" className="watch-trailer-link"><FaPlay />watch trailer</a>
            <a href="#" className="save-later-link"><FaBookmark />save for later</a>
          </div>
        </div>
      </div>
    )
}

export default AppContainer;
