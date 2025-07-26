/*import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { toast } from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [pin, setPin] = useState([]);
  const [suggestedPins, setSuggestedPins] = useState([]);
  // Track loading states separately to prevent race conditions

  const [pinsLoading, setPinsLoading] = useState(false);
  const [savedPinsLoading, setSavedPinsLoading] = useState(false);
  const [pinDetailsLoading, setPinDetailsLoading] = useState(false);
  const [suggestedPinsLoading, setSuggestedPinsLoading] = useState(false);

  async function fetchPins() {
    // Check if we're already loading pins to prevent duplicate calls
    if (pinsLoading) return;

    setPinsLoading(true);
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/pin/all");
      setPins(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPinsLoading(false);
      // Only set overall loading to false if other processes aren't still loading
      if (!savedPinsLoading && !pinDetailsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchPin(id) {
    if (pinDetailsLoading) return;

    setPinDetailsLoading(true);
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/pin/" + id);
      setPin(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPinDetailsLoading(false);
      if (!pinsLoading && !savedPinsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchSavedPins() {
    if (savedPinsLoading) return;

    setSavedPinsLoading(true);
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/pin/saved");
      setSaved(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch saved pins"
      );
    } finally {
      setSavedPinsLoading(false);
      if (!pinsLoading && !pinDetailsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchSuggestedPins(id) {
    if (suggestedPinsLoading) return;
    
    setSuggestedPinsLoading(true);
    setLoading(true);
    setSuggestedPins([]); // Clear previous suggestions
    
    try {
      const { data } = await axios.get(`/api/v8/pin/suggestions/${id}`);
      setSuggestedPins(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch suggested pins"
      );
    } finally {
      // Fix: Reset both loading states
      setSuggestedPinsLoading(false);
      if (!pinsLoading && !pinDetailsLoading && !savedPinsLoading) {
        setLoading(false);
      }
    }
  }

  async function updatePin(id, title, pin, setEdit) {
    try {
      const { data } = await axios.put("/api/v8/pin/" + id, { title, pin });
      toast.success(data.message);
      fetchPin(id);
      setEdit(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePin(id, navigate) {
    try {
      const { data } = await axios.delete(`/api/v8/pin/${id}`);
      toast.success(data.message);
      setPins((prevPins) => prevPins.filter((p) => p._id !== id));
      setPin(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete pin");
    }
  }

  async function addComment(id, comment, setComment) {
    try {
      const { data } = await axios.post("/api/v8/pin/comment/" + id, {
        comment,
      });
      toast.success(data.message);
      fetchPin(id);
      setComment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateComment(id, commentId, comment, callback) {
    try {
      const { data } = await axios.put(
        `/api/v8/pin/comment/${id}?commentId=${commentId}`,
        { comment }
      );
      toast.success(data.message);
      fetchPin(id);
      if (typeof callback === "function") {
        callback();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `/api/v8/pin/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const searchPins = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/user/search", {
        params: { query },
        withCredentials: true,
      });
      setPins(data.results.pins || []);
    } catch (error) {
      console.error("Search pins error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(`/api/v8/pin/like/${id}`);
      toast.success(data.message);
      fetchPin(id);
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSave = async (id) => {
    try {
      const { data } = await axios.post(`/api/v8/pin/save/${id}`);
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  async function addPins(
    formData,
    setFilePrev,
    setFile,
    setTitle,
    setPin,
    navigate
  ) {
    try {
      const { data } = await axios.post("/api/v8/pin/new", formData);
      toast.success(data.message);
      setFilePrev("");
      setFile("");
      setTitle("");
      setPin(data);
      fetchPins();
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Only fetch on mount, not on re-renders
  useEffect(() => {
    // Using a flag to prevent double fetching in development mode (React StrictMode)
    const controller = new AbortController();

    const initialFetch = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPins(), fetchSavedPins()]);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();

    // Cleanup function to prevent memory leaks
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array means it only runs once on mount

  return (
    <PinContext.Provider
      value={{
        fetchPins,
        fetchPin,
        fetchSavedPins,
        pin,
        pins,
        loading,
        addPins,
        updatePin,
        deletePin,
        addComment,
        updateComment,
        deleteComment,
        searchPins,
        handleLike,
        saved,
        handleSave,
        fetchSuggestedPins,
        suggestedPins,
        suggestedPinsLoading
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => useContext(PinContext);*/
/*import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { toast } from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);

  async function fetchPins() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/pin/all");
      setPins(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [pin, setPin] = useState([]);

  async function fetchPin(id) {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/pin/" + id);
      setPin(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function updatePin(id, title, pin, setEdit) {
    try {
      const { data } = await axios.put("/api/v8/pin/" + id, { title, pin });
      toast.success(data.message);
      fetchPin(id);
      setEdit(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchSavedPins() {
    setLoading(true); 
    try{
      const { data } = await axios.get("/api/v8/pin/saved");
      setSaved(data);
    }catch (error){
      toast.error(error.response.data.message);
    }
  }

  async function addComment(id, comment, setComment) {
    try {
      const { data } = await axios.post("/api/v8/pin/comment/" + id, {
        comment,
      });
      toast.success(data.message);
      fetchPin(id);
      setComment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateComment(id, commentId, comment, callback) {
    try {
      const { data } = await axios.put(
        `/api/v8/pin/comment/${id}?commentId=${commentId}`,
        { comment }
      );
      toast.success(data.message);
      fetchPin(id);
      if (typeof callback === "function") {
        callback();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `/api/v8/pin/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const searchPins = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v8/user/search", {
        params: { query },
        withCredentials: true,
      });
      setPins(data.results.pins || []);
    } catch (error) {
      console.error("Search pins error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async(id) => {
    try{
      const {data} = await axios.post(`/api/v8/pin/like/${id}`);
      toast.success(data.message);
      fetchPin(id);
      fetchPins();
    }
    catch(error){
      toast.error(error.response.data.message);
    }
  }
  async function addPins(
    formData,
    setFilePrev,
    setFile,
    setTitle,
    setPin,
    navigate
  ) {
    try {
      const { data } = await axios.post("/api/v8/pin/new", formData);
      toast.success(data.message);
      setFilePrev("");
      setFile("");
      setTitle("");
      setPin(data);
      fetchPins();
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchPins();
    fetchSavedPins();
  }, []);
  return (
    <PinContext.Provider
      value={{
        fetchPins,
        fetchPin,
        fetchSavedPins,
        pin,
        pins,
        loading,
        addPins,
        updatePin,
        addComment,
        updateComment,
        deleteComment,
        searchPins,
        handleLike,
        saved
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => useContext(PinContext);*/

import axios from "axios";
import { server } from "../App"
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { toast } from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [pin, setPin] = useState([]);
  const [suggestedPins, setSuggestedPins] = useState([]);
  // Track loading states separately to prevent race conditions

  const [pinsLoading, setPinsLoading] = useState(false);
  const [savedPinsLoading, setSavedPinsLoading] = useState(false);
  const [pinDetailsLoading, setPinDetailsLoading] = useState(false);
  const [suggestedPinsLoading, setSuggestedPinsLoading] = useState(false);

  async function fetchPins() {
    // Check if we're already loading pins to prevent duplicate calls
    if (pinsLoading) return;

    setPinsLoading(true);
    setLoading(true);
    try {
      const { data } = await axios.get(`https://${server}/api/v8/pin/all`, {
        withCredentials: true
      });
      setPins(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPinsLoading(false);
      // Only set overall loading to false if other processes aren't still loading
      if (!savedPinsLoading && !pinDetailsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchPin(id) {
    if (pinDetailsLoading) return;

    setPinDetailsLoading(true);
    setLoading(true);
    
    // Clear previous pin data and suggested pins when fetching a new pin
    setPin([]);
    setSuggestedPins([]);
    
    try {
      const { data } = await axios.get(`https://${server}/api/v8/pin/` + id, {
        withCredentials: true
      });
      setPin(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPinDetailsLoading(false);
      if (!pinsLoading && !savedPinsLoading && !suggestedPinsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchSavedPins() {
    if (savedPinsLoading) return;

    setSavedPinsLoading(true);
    setLoading(true);
    try {
      const { data } = await axios.get(`https://${server}/api/v8/pin/saved`, {
        withCredentials: true
      });
      setSaved(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch saved pins"
      );
    } finally {
      setSavedPinsLoading(false);
      if (!pinsLoading && !pinDetailsLoading) {
        setLoading(false);
      }
    }
  }

  async function fetchSuggestedPins(id) {
    // Prevent multiple simultaneous calls
    if (suggestedPinsLoading) return;
    
    console.log(`🔍 Frontend: Fetching suggestions for pin ID: ${id}`);
    
    setSuggestedPinsLoading(true);
    // Clear previous suggestions immediately
    setSuggestedPins([]);
    
    try {
      const { data } = await axios.get(`https://${server}/api/v8/pin/suggestions/${id}`, {
        withCredentials: true
      });
      console.log(`✅ Frontend: Received ${data.length} suggestions:`, data.map(pin => pin.title));
      setSuggestedPins(data);
    } catch (error) {
      console.error("❌ Frontend: Error fetching suggestions:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch suggested pins"
      );
      // Set empty array on error
      setSuggestedPins([]);
    } finally {
      setSuggestedPinsLoading(false);
    }
  }

  async function updatePin(id, title, pin, setEdit) {
    try {
      const { data } = await axios.put(`https://${server}/api/v8/pin/` + id, { title, pin }, {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
      setEdit(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePin(id, navigate) {
    try {
      const { data } = await axios.delete(`https://${server}/api/v8/pin/${id}`, {
        withCredentials: true
      });
      toast.success(data.message);
      setPins((prevPins) => prevPins.filter((p) => p._id !== id));
      setPin(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete pin");
    }
  }

  async function addComment(id, comment, setComment) {
    try {
      const { data } = await axios.post(`https://${server}/api/v8/pin/comment/` + id, {
        comment,
      }, {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
      setComment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateComment(id, commentId, comment, callback) {
    try {
      const { data } = await axios.put(
        `https://${server}/api/v8/pin/comment/${id}?commentId=${commentId}`,
        { comment },
       {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
      if (typeof callback === "function") {
        callback();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `https://${server}/api/v8/pin/comment/${id}?commentId=${commentId}`,
       {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const searchPins = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://${server}/api/v8/user/search`, {
        params: { query },
        withCredentials: true,
      });
      setPins(data.results.pins || []);
    } catch (error) {
      console.error("Search pins error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(`https://${server}/api/v8/pin/like/${id}`, {}, {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSave = async (id) => {
    try {
      const { data } = await axios.post(`https://${server}/api/v8/pin/save/${id}`, {}, {
        withCredentials: true
      });
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  async function addPins(
    formData,
    setFilePrev,
    setFile,
    setTitle,
    setPin,
    navigate
  ) {
    try {
      const { data } = await axios.post(`https://${server}/api/v8/pin/new`, formData, {
        withCredentials: true
      });
      toast.success(data.message);
      setFilePrev("");
      setFile("");
      setTitle("");
      setPin(data);
      fetchPins();
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Only fetch on mount, not on re-renders
  useEffect(() => {
    // Using a flag to prevent double fetching in development mode (React StrictMode)
    const controller = new AbortController();

    const initialFetch = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPins(), fetchSavedPins()]);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();

    // Cleanup function to prevent memory leaks
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array means it only runs once on mount

  return (
    <PinContext.Provider
      value={{
        fetchPins,
        fetchPin,
        fetchSavedPins,
        pin,
        pins,
        loading,
        addPins,
        updatePin,
        deletePin,
        addComment,
        updateComment,
        deleteComment,
        searchPins,
        handleLike,
        saved,
        handleSave,
        fetchSuggestedPins,
        suggestedPins,
        suggestedPinsLoading
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => useContext(PinContext);