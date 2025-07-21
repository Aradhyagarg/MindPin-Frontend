import React, { useEffect } from "react";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion"; // For animations
import "./Home.css";
import { UserData } from "../context/userContext";

const Home = ({user}) => {
  const { pins, loading, fetchPins } = PinData();
  useEffect(() => {
    fetchPins();
  }, []);

  const breakpointColumnsObj = {
    default: 5, // Adjusted for a more Pinterest-like layout
    1100: 3,
    700: 2,
    500: 1,
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the appearance of pins
      },
    },
  };

  return (
    <div className="bg-white-to-br from-gray-50 to-gray-100 min-h-screen">
      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className="max-w-[1600px] mx-auto py-6 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-4 py-6 sm:px-0">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-4"
              columnClassName="masonry-grid-column"
            >
              {pins && pins.length > 0 ? (
                pins.map((pin, index) => (
                  <PinCard key={pin._id || index} pin={pin} user={user} />
                ))
              ) : (
                <motion.p
                  className="text-center w-full text-gray-500 text-lg font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No Pins Yet
                </motion.p>
              )}
            </Masonry>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
/*import React, { useEffect } from "react";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import "./Home.css";

const Home = () => {
  const { pins, loading, fetchPins } = PinData();

  useEffect(() => {
    fetchPins();
  }, []);

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
          <div className="px-4 py-6 sm:px-0">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-4"
              columnClassName="masonry-grid-column"
            >
              {pins && pins.length > 0 ? (
                pins.map((pin, index) => <PinCard key={index} pin={pin} />)
              ) : (
                <p className="text-center w-full">No Pins Yet</p>
              )}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;*/