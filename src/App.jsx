import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Navbar from "./components/Navbar";
import PinPage from "./pages/PinPage";
import Sidebar from "./components/Sidebar";
import CreatePin from "./pages/CreatPin";
import Account from "./pages/Account";
import UserProfile from "./pages/UserProfile";
import SearchResults from "./components/SearchResults";
import Settings from "./pages/Settings";
import GoogleCallback from "./pages/GoogleCallback";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";

const App = () => {
  const { loading, isAuth, user } = UserData();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <div className="flex">
            {isAuth && <Sidebar user={user} notificationsCount={99} />}
            <div className={`flex-1 ${isAuth ? "ml-16" : ""}`}>
              {isAuth && <Navbar user={user} />}
              <Routes>
                <Route path="/" element={isAuth ? <Home user={user} /> : <Login />} />
                <Route path="/account" element={isAuth ? <Account /> : <Login />} />
                <Route path="/search" element={isAuth ? <SearchResults /> : <Login />} />
                <Route path="/user/:username" element={isAuth ? <UserProfile user={user} /> : <Login />} />
                <Route path="/pin/:id" element={isAuth ? <PinPage user={user} /> : <Login />} />
                <Route path="/login" element={isAuth ? <Home /> : <Login />} />
                <Route path="/register" element={isAuth ? <Home /> : <Register />} />
                <Route path="/create" element={isAuth ? <CreatePin user={user} /> : <Login />} />
                <Route path="/notifications" element={isAuth ? <Notifications /> : <Login />} />
                <Route path="/settings" element={isAuth ? <Settings /> : <Login />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword /> } />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
};

export default App;


export const server = 'mindpin-backend.onrender.com';