import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the URL parameters (simplified; use a library like qs for complex cases)
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token"); // Adjust based on your backend response

    if (token) {
      // Set the token in cookies (you might need a cookie management library like js-cookie)
      document.cookie = `token=${token}; max-age=${15 * 24 * 60 * 60}; path=/; HttpOnly`; // Note: HttpOnly won't work client-side; use backend to set
      navigate("/profile"); // Redirect to profile
    } else {
      navigate("/login"); // Redirect to login on failure
    }
  }, [navigate, location]);

  return <div>Processing Google Login...</div>; // Loading state
};

export default GoogleCallback;