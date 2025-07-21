import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaImage, FaCheck, FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import { PinData } from "../context/PinContext";

const CreatePin = ({ user }) => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const { addPins } = PinData(); // Access addPins and loading

  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");
  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");

  const handleClick = () => {
    inputRef.current.click();
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pin", pin); // Description field
    formData.append("file", file);

    addPins(formData, setFilePrev, setFile, setTitle, setPin, navigate);
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-0 md:ml-20">
        <motion.div
          className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6 sm:py-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight">
            Create Your Pin
          </h1>

          {/* Stack vertically on small screens, side-by-side on medium screens and up */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Image Upload Section */}
            <motion.div
              className="w-full md:w-1/2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center min-h-[350px] sm:min-h-[450px] flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors duration-300"
                  onClick={handleClick}
                >
                  {filePrev ? (
                    <motion.img
                      src={filePrev}
                      alt="Preview"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaUpload className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-gray-400 animate-bounce" />
                      <p className="text-lg sm:text-xl font-semibold text-gray-700">
                        Drag & Drop or Click to Upload
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-3 max-w-xs">
                        High-quality .jpg files (&lt;20MB) or .mp4 files (&lt;200MB) recommended
                      </p>
                    </motion.div>
                  )}
                </label>
                {filePrev && (
                  <motion.div
                    className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div
              className="w-full md:w-1/2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 placeholder-gray-400 shadow-sm"
                    placeholder="Add a catchy title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 placeholder-gray-400 shadow-sm resize-none"
                    placeholder="Tell everyone about your Pin"
                    rows="5"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>Publish Pin</span>
                  <FaImage className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePin;
/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaImage, FaCheck } from "react-icons/fa"; // Attractive icons
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useRef } from "react";
import { PinData } from "../context/PinContext";

const CreatePin = ({ user }) => {
    const inputRef = useRef();
    const navigate = useNavigate();
    const { addPins } = PinData(); // Access addPins and loading
  
    const [file, setFile] = useState("");
    const [filePrev, setFilePrev] = useState("");
    const [title, setTitle] = useState("");
    const [pin, setPin] = useState("");
  
    const handleClick = () => {
      inputRef.current.click();
    };
  
    const changeFileHandler = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFilePrev(reader.result);
        setFile(file);
      };
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pin", pin); // Description field
      formData.append("file", file);
  
      addPins(formData, setFilePrev, setFile, setTitle, setPin, navigate);
    };
  
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 ml-20">
          <div className="max-w-[1200px] mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a Pin</h1>
        
            <div className="flex gap-8">
              <div className="w-1/2">
                <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl p-6 text-center min-h-[400px] flex flex-col items-center justify-center hover:border-[#74070E] transition-all duration-300">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-[#74070E]"
                    onClick={handleClick}
                  >
                    {filePrev ? (
                      <img
                        src={filePrev}
                        alt="Preview"
                        className="w-full h-auto object-cover rounded-lg mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                      />
                    ) : (
                      <>
                        <FaPlus className="w-10 h-10 mb-4 text-gray-500" />
                        <p className="text-lg">Choose a file or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-2">
                          We recommend using high-quality .jpg files less than 20MB or .mp4 files less than 200MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="w-1/2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74070E] transition-all duration-300 placeholder-gray-400"
                      placeholder="Add a title"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74070E] transition-all duration-300 placeholder-gray-400"
                      placeholder="Add a detailed description"
                      rows="4"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full  bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                        <span>Save</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreatePin;*/