/*import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { MdDelete, MdUpdate } from "react-icons/md";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import { Loading } from "../components/Loading";

const PinPage = ({ user }) => {
  const params = useParams();
  const {
    loading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    updateComment,
    deleteComment,
    deletePin,
    handleLike
  } = PinData();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const editHandler = () => {
    setTitle(pin.title);
    setPinValue(pin.pin);
    setEdit(!edit);
  };

  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit);
  };

  const [comment, setComment] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    addComment(pin._id, comment, setComment);
  };

  const startEditComment = (commentId, commentText) => {
    setEditingComment(commentId);
    setEditCommentText(commentText);
  };

  const updateCommentHandler = (commentId) => {
    updateComment(pin._id, commentId, editCommentText, () => {
      setEditingComment(null);
      setEditCommentText("");
    });
  };

  const deleteCommentHandler = (id) => {
    if (confirm("Are you sure you want to delete this comment"))
      deleteComment(pin._id, id);
  };

  const navigate = useNavigate();

  const deletePinHandler = () => {
    if (confirm("Are you sure you want to delete this pin"))
      deletePin(pin._id, navigate);
  };

  const handleLikeClick = () => {
    handleLike(pin._id);
  };

  useEffect(() => {
    fetchPin(params.id);
  }, [params.id]);

  useEffect(() => {
    if(pin && user && Array.isArray(pin.likes)){
      setLike(pin.likes.includes(user._id));
      setLikesCount(pin.likes.length);
      //setLikesCount(pin.likes.length);
    }
  }, [user, pin]);
  return (
    <div>
      {pin && (
        <div className="flex flex-col items-center bg-gray-100 p-4 min-h-screen">
          {loading ? (
            <Loading />
          ) : (
            <div className="bg-white rounded-lg shadow-lg flex flex-wrap w-full max-w-4xl">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-t-none flex items-center justify-center">
                {pin.image && (
                  <img
                    src={pin.image.url}
                    alt=""
                    className="object-cover w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                )}
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col ">
                <div className="flex items-center justify-between mb-4 ">
                  {edit ? (
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="common-input"
                      style={{ width: "200px" }}
                      placeholder="Enter Title"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{pin.title}</h1>
                  )}

                  {pin.owner && pin.owner._id === user._id && (
                    <button onClick={editHandler}>
                      <FaEdit />
                    </button>
                  )}

                  {pin.owner && pin.owner._id === user._id && (
                    <button
                      onClick={deletePinHandler}
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>

                {edit ? (
                  <input
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value)}
                    className="common-input"
                    style={{ width: "200px" }}
                    placeholder="Enter Title"
                  />
                ) : (
                  <p className="mb-6">{pin.pin}</p>
                )}

                {edit && (
                  <button
                    style={{ width: "200px" }}
                    className="bg-red-500 text-white py-1 px-3 mt-2 mb-2"
                    onClick={updateHandler}
                  >
                    Update
                  </button>
                )}

                <div className="flex items-center mb-4">
                <button
                    onClick={handleLikeClick}
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    {like ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                    <span className="ml-2">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
                  </button>
                </div>

                {pin.owner && (
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div className="flex items-center">
                      <Link to={`/user/${pin.owner.username}`}>
                        <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center">
                          <span className="font-bold">
                            {pin.owner.name.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      </Link>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold">
                          {pin.owner.name}
                        </h2>
                        <p className="text-gray-500">
                          {pin.owner.followers.length} Followers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center mr-4">
                    <span className="font-bold">
                      {pin.owner && pin.owner.name.slice(0, 1)}
                    </span>
                  </div>

                  <form className="flex-1 flex" onSubmit={submitHandler}>
                    <input
                      type="text"
                      placeholder="Enter Comment"
                      className="flex-1 border rounded-lg p-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      className="ml-2 bg-red-500 px-4 py-2 rounded-md text-white"
                    >
                      Add+
                    </button>
                  </form>
                </div>

                <hr className="font-bold text-gray-400 mt-3 mb-3" />

                <div className="overflow-y-auto h-64">
                  {pin.comments && pin.comments.length > 0 ? (
                    pin.comments.map((e, i) => (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center mb-4 justify-center gap-3">
                          <Link to={`/user/${e.user}`}>
                            <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center">
                              <span className="font-bold">
                                {e.name.slice(0, 1)}
                              </span>
                            </div>
                          </Link>

                          <div className="ml-4">
                            <div className="ml-4">
                              <h2 className="text-lg font-semibold">
                                {e.name}
                              </h2>
                              {editingComment === e._id ? (
                                <div className="flex items-center mt-1">
                                  <input
                                    type="text"
                                    value={editCommentText}
                                    onChange={(evt) =>
                                      setEditCommentText(evt.target.value)
                                    }
                                    className="border rounded p-1 mr-2"
                                  />
                                  <button
                                    onClick={() => updateCommentHandler(e._id)}
                                    className="bg-green-500 text-white py-1 px-2 rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingComment(null)}
                                    className="bg-gray-500 text-white py-1 px-2 rounded text-xs ml-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <p className="text-gray-500">{e.comment}</p>
                              )}
                            </div>
                          </div>

                          {e.user === user._id && !editingComment && (
                            <button
                              onClick={() => startEditComment(e._id, e.comment)}
                              className="bg-blue-500 text-white py-1 px-3 rounded"
                            >
                              <MdUpdate />
                            </button>
                          )}

                          {(e.user === user._id || pin.owner._id === user._id) && (
                            <button
                              onClick={() => deleteCommentHandler(e._id)}
                              className="bg-red-500 text-white py-1 px-3 rounded"
                            >
                              <MdDelete />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Be the first one to add comment</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PinPage;*/

/*import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { MdDelete, MdUpdate } from "react-icons/md";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import { Loading } from "../components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";

const PinPage = ({ user }) => {
  const params = useParams();
  const {
    loading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    updateComment,
    deleteComment,
    deletePin,
    handleLike,
    suggestedPins,
    fetchSuggestedPins,
    suggestedPinsLoading,
  } = PinData();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const editHandler = () => {
    setTitle(pin.title);
    setPinValue(pin.pin);
    setEdit(!edit);
  };

  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit);
  };

  const [comment, setComment] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    addComment(pin._id, comment, setComment);
  };

  const startEditComment = (commentId, commentText) => {
    setEditingComment(commentId);
    setEditCommentText(commentText);
  };

  const updateCommentHandler = (commentId) => {
    updateComment(pin._id, commentId, editCommentText, () => {
      setEditingComment(null);
      setEditCommentText("");
    });
  };

  const deleteCommentHandler = (id) => {
    if (confirm("Are you sure you want to delete this comment"))
      deleteComment(pin._id, id);
  };

  const navigate = useNavigate();

  const deletePinHandler = () => {
    if (confirm("Are you sure you want to delete this pin"))
      deletePin(pin._id, navigate);
  };

  const handleLikeClick = () => {
    handleLike(pin._id);
  };

  useEffect(() => {
    console.log(`🔄 URL param changed to: ${params.id}`);
    fetchPin(params.id);
  }, [params.id]);

  useEffect(() => {
    console.log(`🔄 Pin data updated:`, pin?._id, pin?.title);
    if (pin && pin._id && pin._id === params.id) {
      console.log(`🎯 Fetching suggestions for pin: ${pin.title}`);
      fetchSuggestedPins(pin._id);
    }
  }, [pin?._id, params.id]); // Include params.id to ensure suggestions match current pin

  useEffect(() => {
    if (pin && user && Array.isArray(pin.likes)) {
      setLike(pin.likes.includes(user._id));
      setLikesCount(pin.likes.length);
    }
  }, [user, pin]);

  const heartVariants = {
    liked: {
      scale: [1, 1.2, 1],
      color: "#ef4444",
      transition: { duration: 0.3 },
    },
    unliked: { scale: 1, color: "#6b7280" },
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Animation variants for the suggested pins container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      {pin && (
        <div className="flex flex-col items-center p-6 min-h-screen">
          {loading && !suggestedPinsLoading ? (
            <Loading />
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
           
              <div className="w-full md:w-1/2 bg-gray-200 flex items-center justify-center">
                {pin.image && (
                  <motion.img
                    src={pin.image.url}
                    alt=""
                    className="object-cover w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none transition-transform duration-300 hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>

             
              <div className="w-full md:w-1/2 p-8 flex flex-col">
      
                <div className="flex items-center justify-between mb-6">
                  {edit ? (
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      style={{ width: "200px" }}
                      placeholder="Enter Title"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800">
                      {pin.title}
                    </h1>
                  )}

                  {pin.owner && pin.owner._id === user._id && (
                    <div className="flex space-x-3">
                      <motion.button
                        onClick={editHandler}
                        className="text-gray-600 hover:text-blue-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit size={20} />
                      </motion.button>
                      <motion.button
                        onClick={deletePinHandler}
                        className="text-gray-600 hover:text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdDelete size={20} />
                      </motion.button>
                    </div>
                  )}
                </div>

                {edit ? (
                  <textarea
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value)}
                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    style={{ width: "100%", minHeight: "80px" }}
                    placeholder="Enter Description"
                  />
                ) : (
                  <p className="mb-6 text-gray-600 leading-relaxed">
                    {pin.pin}
                  </p>
                )}

                {edit && (
                  <motion.button
                    style={{ width: "200px" }}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={updateHandler}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Update
                  </motion.button>
                )}

                <div className="flex items-center mb-6">
                  <motion.button
                    onClick={handleLikeClick}
                    className="flex items-center"
                    variants={heartVariants}
                    animate={like ? "liked" : "unliked"}
                  >
                    {like ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                    <span className="ml-2 text-gray-700">
                      {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                    </span>
                  </motion.button>
                </div>

                {pin.owner && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                    <Link
                      to={`/user/${pin.owner.username}`}
                      className="flex items-center"
                    >
                      <motion.div
                        className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="font-bold text-gray-700">
                          {pin.owner.name.slice(0, 1).toUpperCase()}
                        </span>
                      </motion.div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {pin.owner.name}
                        </h2>
                        <p className="text-gray-500">
                          {pin.owner.followers.length} Followers
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

    
                <div className="flex items-center mt-4">
                  <motion.div
                    className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-bold text-gray-700">
                      {pin.owner && pin.owner.name.slice(0, 1).toUpperCase()}
                    </span>
                  </motion.div>

                  <form className="flex-1 flex" onSubmit={submitHandler}>
                    <input
                      type="text"
                      placeholder="Enter Comment"
                      className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                    <motion.button
                      type="submit"
                      className="ml-2 bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add+
                    </motion.button>
                  </form>
                </div>

                <hr className="border-gray-300 my-4" />

       
                <div className="overflow-y-auto h-64">
                  <AnimatePresence>
                    {pin.comments && pin.comments.length > 0 ? (
                      pin.comments.map((e, i) => (
                        <motion.div
                          key={e._id}
                          className="flex items-start justify-between mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-start gap-3">
                            <Link to={`/user/${e.user}`}>
                              <motion.div
                                className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span className="font-bold text-gray-700">
                                  {e.name.slice(0, 1).toUpperCase()}
                                </span>
                              </motion.div>
                            </Link>

                            <div className="ml-2">
                              <h2 className="text-md font-semibold text-gray-800">
                                {e.name}
                              </h2>
                              {editingComment === e._id ? (
                                <div className="flex items-center mt-1">
                                  <input
                                    type="text"
                                    value={editCommentText}
                                    onChange={(evt) =>
                                      setEditCommentText(evt.target.value)
                                    }
                                    className="border rounded-lg p-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                  />
                                  <motion.button
                                    onClick={() => updateCommentHandler(e._id)}
                                    className="bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Save
                                  </motion.button>
                                  <motion.button
                                    onClick={() => setEditingComment(null)}
                                    className="bg-gray-500 text-white py-1 px-2 rounded text-xs ml-1 hover:bg-gray-600 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Cancel
                                  </motion.button>
                                </div>
                              ) : (
                                <p className="text-gray-600">{e.comment}</p>
                              )}
                            </div>
                          </div>

                          {(e.user === user._id ||
                            pin.owner._id === user._id) && (
                            <div className="flex space-x-2">
                              {e.user === user._id && !editingComment && (
                                <motion.button
                                  onClick={() =>
                                    startEditComment(e._id, e.comment)
                                  }
                                  className="text-blue-500 hover:text-blue-600"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <MdUpdate size={18} />
                                </motion.button>
                              )}
                              <motion.button
                                onClick={() => deleteCommentHandler(e._id)}
                                className="text-red-500 hover:text-red-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MdDelete size={18} />
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        Be the first one to add a comment
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
      <div className="w-full max-w-5xl mt-8">
        {suggestedPinsLoading ? (
          <p className="text-center text-gray-500">Loading suggestions...</p>
        ) : suggestedPins && suggestedPins.length > 0 ? (
          <motion.div
            key={`suggestions-${pin?._id}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-full gap-4"
              columnClassName="masonry-grid-column"
            >
              {suggestedPins.map((suggestedPin) => (
                <PinCard
                  key={suggestedPin._id}
                  pin={suggestedPin}
                  user={user}
                />
              ))}
            </Masonry>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default PinPage;*/

/*useEffect(() => {
    fetchPin(params.id);
  }, [params.id]);

  useEffect(() => {
    if (pin && pin._id) {
      fetchSuggestedPins(pin._id);
    }
  }, [pin?._id]);

  useEffect(() => {
    if (pin && user && Array.isArray(pin.likes)) {
      setLike(pin.likes.includes(user._id));
      setLikesCount(pin.likes.length);
    }
  }, [user, pin]);*/

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { MdDelete, MdUpdate, MdShare } from "react-icons/md";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import { Loading } from "../components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";

const PinPage = ({ user }) => {
  const params = useParams();
  const {
    loading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    updateComment,
    deleteComment,
    deletePin,
    handleLike,
    suggestedPins,
    fetchSuggestedPins,
    suggestedPinsLoading,
  } = PinData();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  // Handlers
  const editHandler = () => {
    setTitle(pin.title);
    setPinValue(pin.pin);
    setEdit(!edit);
  };

  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addComment(pin._id, comment, setComment);
  };

  const startEditComment = (commentId, commentText) => {
    setEditingComment(commentId);
    setEditCommentText(commentText);
  };

  const updateCommentHandler = (commentId) => {
    updateComment(pin._id, commentId, editCommentText, () => {
      setEditingComment(null);
      setEditCommentText("");
    });
  };

  const deleteCommentHandler = (id) => {
    if (confirm("Are you sure you want to delete this comment?"))
      deleteComment(pin._id, id);
  };

  const deletePinHandler = () => {
    if (confirm("Are you sure you want to delete this pin?"))
      deletePin(pin._id, navigate);
  };

  const handleLikeClick = () => {
    handleLike(pin._id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // Effects
  useEffect(() => {
    console.log(`🔄 URL param changed to: ${params.id}`);
    fetchPin(params.id);
  }, [params.id]);

  useEffect(() => {
    console.log(`🔄 Pin data updated:`, pin?._id, pin?.title);
    if (pin && pin._id && pin._id === params.id) {
      console.log(`🎯 Fetching suggestions for pin: ${pin.title}`);
      fetchSuggestedPins(pin._id);
    }
  }, [pin?._id, params.id]);

  useEffect(() => {
    if (pin && user && Array.isArray(pin.likes)) {
      setLike(pin.likes.includes(user._id));
      setLikesCount(pin.likes.length);
    }
  }, [user, pin]);

  // Animation Variants
  const heartVariants = {
    liked: {
      scale: [1, 1.2, 1],
      color: "#e60023",
      transition: { duration: 0.3 },
    },
    unliked: { scale: 1, color: "#767676" },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading && !suggestedPinsLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      ) : (
        pin && (
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Main Pin Section */}
            <div className="bg-white rounded-3xl shadow-md flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Pin Image */}
              <div className="md:w-1/2 flex items-center justify-center bg-gray-200">
                {pin.image && (
                  <motion.img
                    src={pin.image.url}
                    alt={pin.title}
                    className="object-contain w-full max-h-[80vh] rounded-t-3xl md:rounded-l-3xl md:rounded-t-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>

              {/* Right Column: Pin Details */}
              <div className="md:w-1/2 p-6 flex flex-col">
                {/* Sticky Header: Actions */}
                <div className="sticky top-0 bg-white z-10 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Like Button */}
                      <motion.button
                        onClick={handleLikeClick}
                        className="flex items-center justify-center w-9 h-9"
                        variants={heartVariants}
                        animate={like ? "liked" : "unliked"}
                      >
                        {like ? (
                          <FaHeart size={18} />
                        ) : (
                          <FaRegHeart size={18} />
                        )}
                        {likesCount > 0 && (
                          <span className="ml-1.5 text-sm font-medium text-gray-700">
                            {likesCount}
                          </span>
                        )}
                      </motion.button>
                      {/* Share Button */}
                      <motion.button
                        onClick={handleShare}
                        className="flex items-center justify-center w-9 h-9"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdShare size={18} className="text-gray-700" />
                      </motion.button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {pin.owner && pin.owner._id === user._id && (
                        <>
                          {/* Edit Button */}
                          <motion.button
                            onClick={editHandler}
                            className="flex items-center justify-center w-9 h-9"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaEdit size={18} className="text-gray-700" />
                          </motion.button>
                          {/* Delete Button */}
                          <motion.button
                            onClick={deletePinHandler}
                            className="flex items-center justify-center w-9 h-9"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MdDelete size={18} className="text-red-600" />
                          </motion.button>
                        </>
                      )}
                      {/* Save Button */}
                      <motion.button
                        className="bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-red-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Pin Details */}
                <div className="mt-4">
                  {edit ? (
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-red-500 py-2"
                      placeholder="Enter Title"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {pin.title}
                    </h1>
                  )}

                  {edit ? (
                    <textarea
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value)}
                      className="w-full mt-2 text-gray-600 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter Description"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-gray-600">{pin.pin}</p>
                  )}

                  {edit && (
                    <motion.button
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors"
                      onClick={updateHandler}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Update
                    </motion.button>
                  )}
                </div>

                {/* Owner Info */}
                {pin.owner && (
                  <div className="mt-6 flex items-center">
                    <Link
                      to={`/user/${pin.owner.username}`}
                      className="flex items-center"
                    >
                      <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center">
                        <span className="font-bold text-gray-700">
                          {pin.owner.name.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h2 className="text-sm font-semibold text-gray-900">
                          {pin.owner.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {pin.owner.followers.length} followers
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Comment Form */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Comments
                  </h3>
                  <form
                    onSubmit={submitHandler}
                    className="flex items-center space-x-3"
                  >
                    <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center overflow-hidden">
                      {user?.profilePhoto?.url ? (
                        <img
                          src={user.profilePhoto.url}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {user?.name?.slice(0, 1)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                    <motion.button
                      type="submit"
                      className="text-red-600 font-semibold hover:text-red-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Post
                    </motion.button>
                  </form>
                </div>

                {/* Comments Section */}
                <div className="mt-4 max-h-[40vh] overflow-y-auto">
                  <AnimatePresence>
                    {pin.comments && pin.comments.length > 0 ? (
                      pin.comments.map((comment) => (
                        <motion.div
                          key={comment._id}
                          className="flex items-start space-x-3 mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link to={`/user/${comment.user}`}>
                            <div className="rounded-full h-8 w-8 bg-gray-300 flex items-center justify-center">
                              <span className="font-bold text-gray-700 text-sm">
                                {comment.name.slice(0, 1).toUpperCase()}
                              </span>
                            </div>
                          </Link>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {comment.name}
                              </h4>
                              {(comment.user === user._id ||
                                pin.owner._id === user._id) && (
                                <div className="flex space-x-2">
                                  {comment.user === user._id &&
                                    !editingComment && (
                                      <motion.button
                                        onClick={() =>
                                          startEditComment(
                                            comment._id,
                                            comment.comment
                                          )
                                        }
                                        className="text-gray-500 hover:text-blue-600 text-xs"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        Edit
                                      </motion.button>
                                    )}
                                  <motion.button
                                    onClick={() =>
                                      deleteCommentHandler(comment._id)
                                    }
                                    className="text-gray-500 hover:text-red-600 text-xs"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Delete
                                  </motion.button>
                                </div>
                              )}
                            </div>
                            {editingComment === comment._id ? (
                              <div className="flex items-center mt-1">
                                <input
                                  type="text"
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <motion.button
                                  onClick={() =>
                                    updateCommentHandler(comment._id)
                                  }
                                  className="ml-2 text-green-600 hover:text-green-700 text-xs"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Save
                                </motion.button>
                                <motion.button
                                  onClick={() => setEditingComment(null)}
                                  className="ml-2 text-gray-500 hover:text-gray-600 text-xs"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Cancel
                                </motion.button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 mt-1">
                                {comment.comment}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Suggested Pins Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                More like this
              </h2>
              {suggestedPinsLoading ? (
                <p className="text-center text-gray-500">
                  Loading suggestions...
                </p>
              ) : suggestedPins && suggestedPins.length > 0 ? (
                <motion.div
                  key={`suggestions-${pin?._id}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-3"
                    columnClassName="masonry-grid-column pl-3"
                  >
                    {suggestedPins.map((suggestedPin) => (
                      <PinCard
                        key={suggestedPin._id}
                        pin={suggestedPin}
                        user={user}
                      />
                    ))}
                  </Masonry>
                </motion.div>
              ) : (
                <p className="text-center text-gray-500">
                  No suggested pins available.
                </p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PinPage;
