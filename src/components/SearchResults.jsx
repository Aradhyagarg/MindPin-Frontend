import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { Loading } from "./Loading";
import PinCard from "./PinCard";
import Masonry from "react-masonry-css";

const SearchResults = () => {
  const { pins, loading, searchPins } = PinData();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    if (query && !hasSearched) {
      searchPins(query);
      setHasSearched(true);
    }
  }, [query, searchPins, hasSearched]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4 px-4">Search Results for "{query}"</h2>
          <div className="px-4 py-6 sm:px-0">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-4"
              columnClassName="masonry-grid-column"
            >
              {pins && pins.length > 0 ? (
                pins.map((pin) => <PinCard key={pin._id} pin={pin} />)
              ) : (
                <p className="text-center w-full">No Results Found</p>
              )}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;