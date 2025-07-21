import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaHeart } from "react-icons/fa";
import { PinData } from "../context/PinContext";

const PinCard = ({ pin, user }) => {
  const { handleSave } = PinData();
  

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  function handleSaveClick(e){
    e.preventDefault();
    e.stopPropagation();
    handleSave(pin._id);
    toast.success("Pin saved successfully!");
  }

  return (
    <motion.div
      className="pin-card p-2 w-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/pin/${pin._id}`} className="bg-white overflow-hidden rounded-2xl shadow-md relative group cursor-pointer">
        <img
          src={pin.image?.url || "/placeholder-image.jpg"}
          alt={pin.title || "Pin Image"}
          className="w-full h-auto object-cover rounded-2xl"
          loading="lazy" // Lazy loading for performance
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="hidden"
          whileHover="visible"
        >
          <div className="flex justify-between items-center">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300"
              onClick={handleSaveClick}
            >
              <FaEye className="w-5 h-5" />
              <span>save</span>
            </button>
          </div>

          <div className="text-white">
            <h3 className="text-lg font-semibold truncate">{pin.title || "Untitled Pin"}</h3>
            <p className="text-sm text-gray-200 truncate">
              By {pin.owner?.name || "Unknown"}
            </p>
          </div>
        </motion.div>
        </Link>
    </motion.div>
  );
};

export default PinCard;
/*import React from "react";
import { Link } from "react-router-dom";

const PinCard = ({ pin }) => {
  return (
    <div className="pin-card p-2 w-full">
      <div className="bg-white overflow-hidden shadow rounded-lg relative group cursor-pointer">
        <img
          src={pin.image?.url || "/placeholder-image.jpg"}
          alt={pin.title || "Pin Image"}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <Link
              to={`/pin/${pin._id}`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              View Pin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;*/