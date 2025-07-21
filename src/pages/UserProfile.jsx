import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { Loading } from "../components/Loading";
import { UserData } from "../context/UserContext";
import { motion } from "framer-motion";
import { FaUserPlus, FaUserCheck, FaUserMinus, FaUserPlus as FaUserFollow, FaEye } from "react-icons/fa";

const UserProfile = ({ user: loggedInUser }) => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const { pins, loading } = PinData();
  const { followUser, fetchMonthlyViews, monthlyViews } = UserData();

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/v8/user/${username}`);
      setUser(data.user);
      setIsFollow(data.user.followers.includes(loggedInUser._id));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchMonthlyViews(username); // Fetch monthly views via UserContext
  }, [username, loggedInUser]);

  /*useEffect(() => {
    // Reset loading state when username changes
    setProfileLoading(true);
    
    // Create a single function to load all data
    const loadProfileData = async () => {
      await fetchUser();
      await fetchMonthlyViews(username);
    };
    
    loadProfileData();
  }, [username, loggedInUser]);*/

  function followHandler() {
    setIsFollow(!isFollow);
    followUser(user._id, fetchUser);
  }
  /*async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/v8/user/${username}`);
      setUser(data.user);
      // Check if the logged-in user is already following this user
      setIsFollow(data.user.followers.includes(loggedInUser._id));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchMonthlyViews(username);
  }, [username, loggedInUser]);

  function followHandler() {
    setIsFollow(!isFollow);
    followUser(user._id, fetchUser);
  }*/

  const userPins = pins && user ? pins.filter((pin) => pin.owner?._id === user._id) : [];

  const breakpointColumnsObj = {
    default: 5, // Adjusted for a Pinterest-like layout
    1100: 3,
    700: 2,
    500: 1,
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const profileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-[1600px] mx-auto px-4 py-10 sm:px-6 lg:px-8">
          {user ? (
            <motion.div
              className="bg-white rounded-2xl p-8 mb-12 transition-all duration-300"
              variants={profileVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col items-center">
                <div className="relative group mb-6">
                  {user.profilePhoto?.url ? (
                    <motion.img
                      src={user.profilePhoto.url}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <motion.span
                      className="flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gray-200 text-4xl text-gray-700 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {user.name?.slice(0, 1).toUpperCase() || "?"}
                    </motion.span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-gray-600 text-lg mt-2">@{user.username}</p>
                <p className="text-gray-600 mt-3 max-w-md text-center leading-relaxed">
                  {user.about || "No bio available."}
                </p>
                <div className="flex space-x-6 mt-6">
                  <Link to={`/followers/${user.username}`} className="flex items-center space-x-2">
                    <FaUserPlus className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      {user.followers?.length || 0} Followers
                    </span>
                  </Link>
                  <Link to={`/followings/${user.username}`} className="flex items-center space-x-2">
                    <FaUserCheck className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      {user.following?.length || 0} Following
                    </span>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <FaEye className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      {monthlyViews} Profile Views This Month
                    </span>
                  </div>
                </div>
                {loggedInUser._id !== user._id && (
                  <motion.button
                    onClick={followHandler}
                    className={`mt-6 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-md transition-all duration-300 ${
                      isFollow
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isFollow ? (
                      <>
                        <FaUserMinus className="w-5 h-5" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <FaUserFollow className="w-5 h-5" />
                        <span>Follow</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-10 text-gray-600 text-lg font-semibold">
              User not found.
            </div>
          )}
          <motion.div
            className="py-6 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-4"
              columnClassName="masonry-grid-column"
            >
              {userPins.length > 0 ? (
                userPins.map((pin) => <PinCard key={pin._id} pin={pin} />)
              ) : (
                <p className="text-center w-full text-gray-500 text-lg font-semibold">
                  No Pins Yet
                </p>
              )}
            </Masonry>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile;