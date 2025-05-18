import {
  FaRegStar,
  FaPlay,
  FaBookmark,
  FaSearch,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { PiHeartStraightBold } from "react-icons/pi";
import { useState } from "react";
import "./AppContainer.css";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

function AppContainer() {
  const [searchedShow, setSearchedShow] = useState("");

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["get-show-data"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.tvmaze.com/singlesearch/shows?q=${searchedShow}`
      );
      console.log(response.data);
      return response.data;
    },
    enabled: false,
  });

  async function handleSearch(e) {
    e.preventDefault();
    refetch();
  }

  return (
    <div className="app-container">
      <form action="" className="form-container" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="search for a tV series"
          value={searchedShow}
          onChange={(e) => {
            setSearchedShow(e.target.value);
          }}
        />
        <button disabled={isFetching}>
          <FaSearch />
        </button>
      </form>

      {isFetching && (
        <div className="loader-container">
          <PulseLoader size={30} color="#f5c417" />
        </div>
      )}

      {!isFetching &&isError && (
        <div className="error-container">
          <h1>could not get your show</h1>
        </div>
      )}

      {!isFetching &&!isError  &&data && (
        <div className="show-card-container">
          <ShowCard
            key={data.id}
            showThumbnail={data.image.original}
            showTitle={data.name}
            rating={data.rating.average}
            runtime={data.runtime}
            weight={data.weight}
            premiered={data.premiered}
            ended={data.ended}
            trailerLink={`https://www.google.com/search?q=${data.name} trailer`}
            data={data}
          />
        </div>
      )}
    </div>
  );
}

function ShowCard({
  showThumbnail,
  showTitle,
  rating,
  runtime,
  weight,
  premiered,
  ended,
  trailerLink,
  data,
}) {
  const formattedPremierDate = format(new Date(premiered), "MMM yyyy");
  let formattedEndDate;

  if(!ended){
    formattedEndDate="present"
  }else{
    formattedEndDate = format(new Date(ended), "MMM yyyy");
  }


  if (!runtime) {
    runtime = "--";
  }

  if (!rating) {
    rating = "unrated";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(data.summary, "text/html");
  const cleanSummary = doc.body.textContent || "";

  return (
    <div className="show-card">
      <div className="show-card-left">
        <img src={showThumbnail} alt="" />
      </div>

      <div className="show-card-right">
        <h1 className="show-title">{showTitle}</h1>
        <div className="genres-container">
          {data.genres.map((genre) => (
            <p key={Math.random()} className="genre">
              {genre}
            </p>
          ))}
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
            <p>
              {formattedPremierDate} - {!formattedEndDate ? "present" : formattedEndDate}
            </p>
          </div>
        </div>

        <p className="show-excerpt">{cleanSummary}</p>

        <div className="links-container">
          <a href={trailerLink} target="_blank" className="watch-trailer-link">
            <FaPlay />
            watch trailer
          </a>
        </div>
      </div>
    </div>
  );
}

export default AppContainer;
