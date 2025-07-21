import React, { useEffect, useState, useCallback } from "react";
import { UserData } from "../context/UserContext";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { Link, useNavigate } from "react-router-dom";
import { FaPen, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

const Account = () => {
  const { user, deactivateAccount, deleteAccount } = UserData();
  const { pins, loading, saved, fetchSavedPins } = PinData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("created");
  const [createdPins, setCreatedPins] = useState([]);

  // Memoize tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === "saved" && saved.length > 0) {
      fetchSavedPins();
    }
  }, [saved.length, fetchSavedPins]);

  // Filter created pins
  useEffect(() => {
    if (pins && user) {
      const created = pins.filter(
        (pin) => pin.owner && pin.owner._id === user._id
      );
      setCreatedPins(created);
    }
  }, [pins, user]);

  const handleEditProfile = () => {
    navigate("/settings");
  };

  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      await deactivateAccount(navigate);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    ) {
      await deleteAccount(navigate);
    }
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Animation variants for buttons and tabs
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const tabVariants = {
    active: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.3 } },
    inactive: { y: 5, opacity: 0.7, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
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
            <motion.button
              onClick={handleEditProfile}
              className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
              title="Edit Profile"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaPen className="w-5 h-5" />
            </motion.button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">
            {user.name}
          </h1>
          <p className="text-gray-600 text-lg mt-2">@{user.username}</p>
          <p className="text-gray-600 mt-3 max-w-md text-center leading-relaxed">
            {user.about || "Add a bio to tell others about yourself."}
          </p>
          <div className="flex space-x-6 mt-6">
            <Link to={`/followers/${user._id}`} className="flex items-center space-x-2">
              <FaUserPlus className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">
                {user.followers?.length || 0} Followers
              </span>
            </Link>
            <Link to={`/followings/${user._id}`} className="flex items-center space-x-2">
              <FaUserCheck className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">
                {user.following?.length || 0} Following
              </span>
            </Link>
          </div>
          <div className="mt-6 flex space-x-4">
            <motion.button
              onClick={handleEditProfile}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Edit Profile
            </motion.button>
            <motion.button
              onClick={handleDeactivate}
              className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-600"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Deactivate
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-800"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-10">
          <motion.button
            onClick={() => handleTabChange("created")}
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === "created"
                ? "border-b-4 border-red-500 text-red-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
            variants={tabVariants}
            animate={activeTab === "created" ? "active" : "inactive"}
          >
            Created
          </motion.button>
          <motion.button
            onClick={() => handleTabChange("saved")}
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === "saved"
                ? "border-b-4 border-red-500 text-red-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
            variants={tabVariants}
            animate={activeTab === "saved" ? "active" : "inactive"}
          >
            Saved
          </motion.button>
        </div>

        {/* Pins Grid */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center text-gray-600 text-lg font-semibold">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {activeTab === "created" &&
                (createdPins.length > 0 ? (
                  createdPins.map((pin) => (
                    <PinCard key={pin._id} pin={pin} user={user} />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500 text-lg font-semibold">
                    No pins created yet.
                  </p>
                ))}

              {activeTab === "saved" &&
                (saved.length > 0 ? (
                  saved.map((pin) => (
                    <PinCard key={pin._id} pin={pin} user={user} />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500 text-lg font-semibold">
                    No pins saved yet.
                  </p>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Account;
/*import React, { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { Link, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";

const Account = () => {
  const { user, deactivateAccount, deleteAccount } = UserData();
  const { pins, loading, saved } = PinData();
  console.log(saved);
  console.log(pins);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("created");
  const [createdPins, setCreatedPins] = useState([]);
  //const [savedPins, setSavedPins] = useState([]);
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pins && user) {
      const created = pins.filter(
        (pin) => pin.owner && pin.owner._id === user._id
      );
      setCreatedPins(created);
    }
  }, [pins, user]);

  const handleEditProfile = () => {
    navigate("/settings");
  };

  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      await deactivateAccount(navigate);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    ) {
      await deleteAccount(navigate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {user.profilePhoto?.url ? (
              <img
                src={user.profilePhoto.url}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            ) : (
              <span className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 text-3xl text-gray-700">
                {user.name?.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
            <button
              onClick={handleEditProfile}
              className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
              title="Edit Profile"
            >
              <FaPen />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-600 mt-2 max-w-md text-center">
            {user.about || "No bio yet."}
          </p>
          <div className="flex space-x-4 mt-4">
            <Link to={`/followers/${user._id}`}>
              <span className="font-semibold">
                {user.followers?.length || 0} Followers
              </span>
            </Link>
            <Link to={`/followings/${user._id}`}>
              <span className="font-semibold">
                {user.following?.length || 0} Following
              </span>
            </Link>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleEditProfile}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDeactivate}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
            >
              Deactivate Account
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800"
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="flex justify-center border-b border-gray-200">
          <button
            onClick={() => setActiveTab("created")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "created"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "saved"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
          >
            Saved
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeTab === "created" &&
                (createdPins.length > 0 ? (
                  createdPins.map((pin) => (
                    <PinCard key={pin._id} pin={pin} user={user} />
                  ))
                ) : (
                  <p className="text-center col-span-full">
                    No pins created yet.
                  </p>
                ))}

              {activeTab === "saved" &&
                (saved.length > 0 ? (
                  saved.map((pin) => (
                    <PinCard key={pin._id} pin={pin} user={user} />
                  ))
                ) : (
                  <p className="text-center col-span-full">
                    No pins saved yet.
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;*/