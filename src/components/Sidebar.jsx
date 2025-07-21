import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import ideasLogo from "../assets/ideas.png";
import "./Sidebar.css";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { logoutUser, unreadNotifications } = UserData();
  const toggleButtonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleSettings = (e) => {
    e.stopPropagation();
    setShowSettings((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setShowSettings(false);
  };

  const handleLogout = () => {
    logoutUser();
    handleCloseMenu();
  };

  // Handle navigation with animation delay
  const handleNavigate = (path) => {
    handleCloseMenu();
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  // Close the settings menu on clicks outside
  useEffect(() => {
    const handleClick = (event) => {
      // Ignore clicks on the toggle button
      if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target)) {
        return;
      }

      // If the click is on a navigable Link, let the custom handler manage it
      const isLink = event.target.closest("a");
      if (isLink) {
        return;
      }

      // Close the menu for all other clicks
      if (showSettings) {
        handleCloseMenu();
      }
    };

    if (showSettings) {
      setTimeout(() => {
        document.addEventListener("click", handleClick);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showSettings]);

  // Check if the current path matches or starts with the given path
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-white shadow-lg flex flex-col items-center py-6 z-20 sidebar">
      <Link to="/" className="flex items-center justify-center mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center hover:shadow-md transition-shadow duration-300">
          <img src={ideasLogo} alt="Pinterest Logo" className="h-7 w-7 object-contain" />
        </div>
      </Link>
      
      <div className="flex flex-col items-center space-y-6 flex-grow">
        <Link
          to="/"
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 sidebar-icon ${
            isActivePath("/") 
              ? "bg-black text-white hover:bg-gray-800" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
        
        <Link
          to="/explore"
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 sidebar-icon ${
            isActivePath("/explore") 
              ? "bg-black text-white hover:bg-gray-800" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Link>
        
        <Link
          to="/create"
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 sidebar-icon ${
            isActivePath("/create") 
              ? "bg-black text-white hover:bg-gray-800" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
        
        <Link
          to="/notifications"
          className={`p-2 rounded-full relative transition-all duration-300 transform hover:scale-110 sidebar-icon ${
            isActivePath("/notifications") 
              ? "bg-black text-white hover:bg-gray-800" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadNotifications > 99 ? "99+" : unreadNotifications}
            </span>
          )}
        </Link>
        
        <Link
          to="/messages"
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 sidebar-icon ${
            isActivePath("/messages") 
              ? "bg-black text-white hover:bg-gray-800" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </Link>
      </div>
      
      <div className="relative mt-auto">
        <button
          ref={toggleButtonRef}
          onClick={toggleSettings}
          className={`p-2 rounded-full transition-all duration-300 hover:bg-gray-100 ${
            showSettings ? "ring-2 ring-gray-300 bg-gray-100" : ""
          }`}
          aria-label="Toggle settings menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        
        {showSettings && (
          <div
            ref={menuRef}
            className="absolute bottom-0 left-16 bg-white shadow-xl rounded-lg w-64 border border-gray-100 dropdown"
            style={{ 
              opacity: showSettings ? 1 : 0, 
              pointerEvents: showSettings ? "auto" : "none",
              transform: showSettings ? "scale(1)" : "scale(0.95)",
              transformOrigin: "top left",
              transition: "opacity 0.2s, transform 0.2s"
            }}
            role="menu"
            aria-expanded={showSettings}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePhoto?.url ? (
                    <img
                      src={user.profilePhoto.url}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-600">
                      {user?.name?.slice(0, 1)?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
            </div>
            
            <ul className="py-2 text-sm">
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Home feed tuner</span>
              </li>
              
              <li
                onClick={() => handleNavigate("/claim")}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Claim external accounts</span>
              </li>
              
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Install the Chrome app</span>
              </li>
              
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Reports and violations centre</span>
              </li>
              
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your privacy rights</span>
              </li>
              
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help Centre</span>
              </li>
              <li
                onClick={handleCloseMenu}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Be a beta tester</span>
              </li>
              
              <li
                onClick={() => handleNavigate("/settings")}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer dropdown-item"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </li>
              
              <li
                onClick={handleLogout}
                className="mt-2 px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer dropdown-item border-t border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;