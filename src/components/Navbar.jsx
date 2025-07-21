import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";

const Navbar = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState({
    users: [],
    pins: [],
  });
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const debounceRef = useRef(null); // To store debounce instance

  const fetchSuggestions = useCallback((query) => {
    if (!query.trim()) {
      setSearchSuggestions({ users: [], pins: [] });
      setIsSuggestionsOpen(false);
      return;
    }

    const debouncedFetch = debounce(async (q) => {
      try {
        const { data } = await axios.get(`/api/v8/user/search`, {
          params: { query: q },
          withCredentials: true,
        });
        setSearchSuggestions(data.results);
        setIsSuggestionsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to fetch suggestions");
      }
    }, 300);

    debouncedFetch(query);
    debounceRef.current = debouncedFetch; // Store the debounced function
  }, []);

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    // Cancel any pending debounced requests
    if (debounceRef.current) {
      debounceRef.current.cancel();
    }

    // Reset all states before navigation
    setSearchQuery("");
    setSearchSuggestions({ users: [], pins: [] });
    setIsSuggestionsOpen(false);

    // Navigate to search results
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (type, id) => {
    console.log("Clicked:", type, id);
    if (debounceRef.current) {
      debounceRef.current.cancel();
    }

    setSearchQuery("");
    setSearchSuggestions({ users: [], pins: [] });
    setIsSuggestionsOpen(false);

    if (type === "user") {
      navigate(`/user/${id}`);
    } else if (type === "pin") {
      navigate(`/pin/${id}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.matches(":focus")) {
        setIsSuggestionsOpen(false);
        setSearchSuggestions({ users: [], pins: [] });
      }
    }, 200);
  };

  const handleFocus = () => {
    if (
      searchQuery.trim() &&
      (searchSuggestions.users.length > 0 ||
        searchSuggestions.pins.length > 0) &&
      location.pathname !== "/search"
    ) {
      setIsSuggestionsOpen(true);
    }
  };

  useEffect(() => {
    // Reset suggestions when the route changes
    setIsSuggestionsOpen(false);
    setSearchSuggestions({ users: [], pins: [] });

    // Cleanup debounce on unmount
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    };
  }, [location.pathname]);

  // Additional effect to ensure suggestions don't open on /search
  useEffect(() => {
    if (location.pathname === "/search") {
      setIsSuggestionsOpen(false);
      setSearchSuggestions({ users: [], pins: [] });
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    }
  }, [location.pathname]);

  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="max-w-[1440px] mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex-1 mx-4 relative">
          <form onSubmit={handleFullSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </span>
          </form>

          {isSuggestionsOpen &&
            (searchSuggestions.users.length > 0 ||
              searchSuggestions.pins.length > 0) &&
            location.pathname !== "/search" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-20">
                {searchSuggestions.users.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-600 px-2 py-1">
                      Users
                    </h3>
                    {searchSuggestions.users.map((userResult) => (
                      <div
                        key={userResult._id}
                        onClick={() =>
                          handleSuggestionClick("user", userResult._id)
                        }
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                          <span className="text-gray-700">
                            {userResult.name.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {userResult.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userResult.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchSuggestions.pins.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-600 px-2 py-1">
                      Pins
                    </h3>
                    {searchSuggestions.pins.map((pin) => (
                      <div
                        key={pin._id}
                        onClick={() => handleSuggestionClick("pin", pin._id)}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={pin.image?.url || "placeholder.jpg"}
                          alt={pin.title}
                          className="w-12 h-12 object-cover rounded-md mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium">{pin.title}</p>
                          <p className="text-xs text-gray-500">
                            by {pin.owner?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/account"
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 hover:bg-gray-400"
          >
            {user.profilePhoto?.url ? (
                    <img
                      src={user.profilePhoto.url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
