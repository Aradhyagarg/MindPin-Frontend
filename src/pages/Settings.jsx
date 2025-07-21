import React, { useState, useEffect, useRef } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Settings = () => {
  const {
    user,
    isAuth,
    btnLoading,
    editProfile,
    updateAccount,
    deactivateAccount,
    deleteAccount,
  } = UserData();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("edit-profile");

  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [about, setAbout] = useState(user.about || "");
  const [website, setWebsite] = useState(user.website || "");
  const [profilePhoto, setProfilePhoto] = useState(
    user.profilePhoto?.url || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileVisibility, setProfileVisibility] = useState(
    user.profileVisibility || "public"
  );
  /*const [profilePhotoPreview, setProfilePhotoPreview] = useState(
    user.profilePhoto?.url || ""
  );*/
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //const fileInputRef = useRef(null);

  useEffect(() => {
    setName(user.name || "");
    setUsername(user.username || "");
    setAbout(user.about || "");
    setWebsite(user.website || "");
    setSelectedFile(null);
    setProfilePhoto(user.profilePhoto?.url || "");
    //setProfilePhotoPreview(user.profilePhoto?.url || "");
    setProfileVisibility(user.profileVisibility || "public");
    setEmail(user.email || "");
  }, [user]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    await editProfile({
      name,
      username,
      about,
      website,
      profilePhoto: selectedFile || profilePhoto,
      profileVisibility,
    });
    //setProfilePhoto(user.profilePhoto?.url || "");
    setSelectedFile(null);
    //setProfilePhoto(null);
    //setProfilePhotoPreview(user.profilePhoto?.url || "");
    //fileInputRef.current.value = ""; // Clear file input
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await updateAccount(password, confirmPassword);
    //toast.success("Account updated successfully");
    setPassword("");
    setConfirmPassword("");
  };

  const handleDeactivateAccount = async (e) => {
    if (!window.confirm("Are you sure you want to deactivate your account?"))
      return;
    await deactivateAccount(navigate);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      )
    )
      return;
    await deleteAccount(navigate);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file (e.g., PNG, JPEG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }
      setSelectedFile(file);
      // Create a temporary URL for displaying the image preview
      setProfilePhoto(URL.createObjectURL(file));
      //setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  /*const handleChangePhotoClick = () => {
    fileInputRef.current.click();
  };*/

  const handleResetProfile = () => {
    setName(user.name || "");
    setUsername(user.username || "");
    setAbout(user.about || "");
    setWebsite(user.website || "");
    //setSelectedFile(null);
    setProfilePhoto(
      user.profilePhoto?.url || user.name.charAt(0).toUpperCase() || ""
    );
    //setProfilePhotoPreview(user.profilePhoto?.url || user.name.charAt(0).toUpperCase() || "");
    setProfileVisibility(user.profileVisibility || "public");
    //fileInputRef.current.value = ""; // Clear file input
  };

  return (
    <div className="flex max-w-5xl mx-auto p-6 mt-8">
      <div className="w-1/4 pr-6">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveSection("edit-profile")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeSection === "edit-profile"
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Edit profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("account-management")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeSection === "account-management"
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Account management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("profile-visibility")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeSection === "profile-visibility"
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Profile visibility
            </button>
          </li>
        </ul>
      </div>
      <div className="w-3/4 bg-white rounded-lg p-6">
        {activeSection === "edit-profile" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Edit profile
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Keep your personal details private. Information you add here is
              visible to anyone who can view your profile.
            </p>
            <form onSubmit={handleEditProfile} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500 relative overflow-hidden">
                  {profilePhoto ? (
                    <>
                      <img
                        src={profilePhoto}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                      {btnLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : (
                    user.name?.charAt(0).toUpperCase() || ""
                  )}
                </div>

                <label className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-300">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Surname"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tell your story"
                  rows="4"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={btnLoading}
                    className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 ${
                      btnLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {btnLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {activeSection === "account-management" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Account Management
            </h2>
            <form onSubmit={handleUpdateAccount} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(user.email || "");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300`}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={btnLoading}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    btnLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {btnLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Deactivation and Deletion
              </h3>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Deactivate Account
                  </h4>
                  <p className="text-sm text-gray-600">
                    Temporarily hide your profile, Pins, and boards.
                  </p>
                </div>
                <button
                  onClick={handleDeactivateAccount}
                  disabled={btnLoading}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    btnLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {btnLoading ? "Processing..." : "Deactivate account"}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Delete Your Data and Account
                  </h4>
                  <p className="text-sm text-gray-600">
                    Permanently delete your data and everything associated with
                    your account.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={btnLoading}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    btnLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {btnLoading ? "Processing..." : "Delete account"}
                </button>
              </div>
            </div>
          </>
        )}

        {activeSection === "profile-visibility" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Profile Visibility
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Manage how your profile can be viewed on and off this platform.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Private Profile
                  </h4>
                  <p className="text-sm text-gray-600">
                    When your profile is private, only the people you approve
                    can see your profile, pins, boards, followers, and following
                    lists.{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Learn more
                    </a>
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileVisibility === "private"}
                    onChange={(e) =>
                      setProfileVisibility(
                        e.target.checked ? "private" : "public"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-500 peer-checked:bg-red-600 transition-all duration-300`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        profileVisibility === "private" ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setProfileVisibility(user.profileVisibility)}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300`}
                >
                  Reset
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={btnLoading}
                  className={`px-6 py-2 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    btnLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {btnLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
