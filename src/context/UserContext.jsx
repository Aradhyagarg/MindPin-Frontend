import axios from "axios";
import { server } from "../App";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { toast, Toaster } from "react-hot-toast";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [monthlyViews, setMonthlyViews] = useState(0);
  const [isMonthlyViewsLoading, setIsMonthlyViewsLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsLoading, setNotificationsLoading] = useState(false);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`https://${server}/api/v8/user/login`, {
        email,
        password,
      });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const [loading, setLoading] = useState(true);
  async function fetchUser() {
    try {
      const { data } = await axios.get(`https://${server}/api/v8/user/me`);
      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    //fetchUnreadNotifications();
    fetchNotifications();
  }, []);

  async function registerUser(name, username, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`https://${server}/api/v8/user/register`, {
        name,
        username,
        email,
        password,
      });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  /*async function fetchUnreadNotifications() {
    try {
      const { data } = await axios.get("/api/v8/user/unread-notifications");
      setUnreadNotifications(data.unreadNotifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      //setUnreadNotifications(0);
    }
  }*/

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const { data } = await axios.get(`https://${server}/api/v8/user/notifications`);
      console.log("Fetched notifications:", data.notifications);
      setUnreadNotifications(data.unreadNotifications);
      setNotifications(data.notifications);
      setNotificationsLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
      setNotificationsLoading(false);
    }
  };

  /*async function notificationsRead(notificationId) {
    try {
        console.log(`Attempting to mark notification ${notificationId} as read`);
      await axios.put(`/api/v8/user/notifications/${notificationId}`);
      console.log("API response:", response.data);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      await fetchUnreadNotifications();
      // Optionally re-fetch notifications for consistency
      await fetchNotifications();
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }*/
  async function notificationsRead(notificationId) {
    try {
      const {data} = await axios.put(
        `https://${server}/api/v8/user/notifications/${notificationId}`);
      //console.log("API response:", response.data);
      setUnreadNotifications(data.unreadNotifications);
      setNotifications(data.notifications);
      return true;
      //setNotificationsLoading(false);
      // Update notifications state to mark as read
      //return true; // Indicate success
    } catch (error) {
      console.error("Error marking notification as read:", error.response?.data || error.message);
      toast.error("Failed to mark notification as read");
      return false; // Indicate failure
    }
  }

  useEffect(() => {
    let interval;
    if (isAuth) {
      interval = setInterval(() => {
        if (!document.hidden) {
        //fetchUnreadNotifications();
        fetchNotifications();
        }
      }, 10000); // Poll every 15 seconds (adjust as needed)
    }
    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount or isAuth change
    };
  }, [isAuth]);

  async function forgetPassword(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`https://${server}/api/v8/user/forgot-password`, {
        email,
      });
      toast.success(data.message);
      navigate("/reset-password", { state: { email } });
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      setBtnLoading(false);
    }
  }

  async function resetPassword(email, otp, newPassword, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`https://${server}/api/v8/user/reset-password`, {
        email,
        otp,
        newPassword,
      });
      toast.success(data.message);
      navigate("/");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      setBtnLoading(false);
    }
  }

  async function followUser(id, fetchUser) {
    try {
      const { data } = await axios.post(`https://${server}/api/v8/user/follow/` + id);
      toast.success(data.message);
      fetchUser();
    } catch (error) {}
  }

  async function editProfile({
    name,
    username,
    about,
    website,
    profilePhoto,
    profileVisibility,
  }) {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("about", about);
      formData.append("website", website);
      formData.append("profileVisibility", profileVisibility);
      if (profilePhoto) {
        formData.append("file", profilePhoto);
      }
      const { data } = await axios.put(`https://${server}/api/v8/user/edit-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message);
      await fetchUser();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      setBtnLoading(false);
    }
  }

  async function updateAccount(email, password) {
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `https://${server}/api/v8/user/account`,
        { email, password },
        { withCredentials: true }
      );
      toast.success(data.message);
      await fetchUser();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update account");
      setBtnLoading(false);
    }
  }

  async function deactivateAccount(navigate) {
    setBtnLoading(true);
    try {
      const data = await axios.put(
        `https://${server}/api/v8/user/account`,
        { action: "deactivate" },
        { withCredentials: true }
      );
      toast.success(data.message);
      setUser([]);
      setIsAuth(false);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to deactivate account"
      );
      setBtnLoading(false);
    }
  }

  async function deleteAccount(navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `https://${server}/api/v8/user/account`,
        { action: "delete" },
        { withCredentials: true }
      );
      toast.success(data.message);
      setUser([]);
      setIsAuth(false);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      setBtnLoading(false);
    }
  }

  async function fetchMonthlyViews(username) {
    try {
      const { data } = await axios.get(
        `https://${server}/api/v8/user/${username}/monthly-views`
      );
      setMonthlyViews(data.monthlyViews || 0);
    } catch (error) {
      console.error("Error fetching monthly views:", error);
      setMonthlyViews(0);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.get(`https://${server}/api/v8/user/logout`);
      toast.success(data.message);
      setUser([]);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <UserContext.Provider
      value={{
        loginUser,
        registerUser,
        btnLoading,
        user,
        isAuth,
        loading,
        logoutUser,
        followUser,
        editProfile,
        updateAccount,
        deleteAccount,
        deactivateAccount,
        fetchMonthlyViews,
        monthlyViews,
        isMonthlyViewsLoading,
        forgetPassword,
        resetPassword,
        unreadNotifications,
        notifications,
        isNotificationsLoading,
        notificationsRead
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
