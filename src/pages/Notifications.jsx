// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const { user, notifications, isNotificationsLoading, notificationsRead } = UserData();
  const navigate = useNavigate();
  //const navigate = useNavigate();

  /*const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/v8/user/notifications/${notificationId}/read`, {}, {
        withCredentials: true,
      });
      // Remove the notification from state
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      fetchUnreadNotifications(); // Update unread count
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };*/

  // Optional: Delete notification instead of marking as read
  /*const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/v8/user/notifications/${notificationId}`, {
        withCredentials: true,
      });
      // Remove the notification from state
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      fetchUnreadNotifications(); // Update unread count
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };*/

  /*const handleNotificationClick = async (notificationId, pinId) => {
    if (pinId) {
      // Use markNotificationAsRead or deleteNotification based on your preference
      await markNotificationAsRead(notificationId);
      // await deleteNotification(notificationId); // Uncomment if you prefer deletion
      navigate(`/pin/${pinId}`);
    } else {
      console.error("No pinId for notification");
      toast.error("Cannot navigate to pin");
    }
  };*/

  /*useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      // Removed markNotificationsAsRead to keep notifications unread until clicked
    }
  }, [user]);*/

  /*if (isNotificationsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }*/

  /*useEffect(() => {
    console.log("ho", notifications);
    notifications.forEach((noti, index) => {
        console.log(`Notification #${index} pinId:`, noti.pinId?._id);
        console.log(`Notification #${index} message:`, noti.message);
      });
    //console.log("id", notifications._id);
  }, [notifications]);*/

  //console.log("Rendering notifications:", notifications.length, notifications); // Debug log

  const handleNotificationClick = async (notificationId, pinId) => {
    if (!pinId) {
      toast.error("Cannot navigate to pin: Invalid pin ID");
      return;
    }

    try {
      console.log(`Handling click for notification ${notificationId}, pin ${pinId}`);
      const success = await notificationsRead(notificationId);
      if (success) {
        navigate(`/pin/${pinId}`);
      } else {
        toast.error("Failed to process notification due to server issue");
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
      toast.error("Failed to process notification");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Notifications ({notifications.length})</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              //onClick={() => handleNotificationClick(notification._id, notification.pinId?._id)}
              onClick={() => handleNotificationClick(notification._id, notification.pinId._id)}
              className={`flex items-center p-4 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                {notification.userId?.profilePhoto?.url ? (
                  <img
                    src={notification.userId.profilePhoto.url}
                    alt={notification.userId.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {notification.userId?.name?.slice(0, 1)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notification.message}</p>
                {notification.pinId && (
                  <div className="mt-2 flex items-center">
                    <img
                      src={notification.pinId.image?.url}
                      alt={notification.pinId.title}
                      className="w-12 h-12 object-cover rounded-md mr-2"
                    />
                    <span className="text-xs text-gray-500">{notification.pinId.title}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;