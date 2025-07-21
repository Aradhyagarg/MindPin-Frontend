import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext';

const LoadingAnimation = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    </div>
  );

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, btnLoading, forgetPassword } = UserData();
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const handleResendOTP = () => {
    forgetPassword(email, navigate);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newPassword !== confirmPassword){
      toast.error('Passwords do not match');
      return;
    }
    resetPassword(email, otp, newPassword, navigate);
    navigate('/register')
  }

  useEffect(() => {
    if(!email){
        navigate('/forgot-password');
    }
  }, [email, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png"
            alt="Pinterest"
            className="h-12"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to <span className="font-medium"></span> and your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              6-Digit OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                type={showPassword ? "name" : "password"}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                type={showConfirmPassword ? "name" : "password"}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-4">
            Password must be at least 8 characters long and contain:
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (!@#$%^&*)</li>
              <li>No spaces</li>
            </ul>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            disabled={btnLoading}
          >
            {btnLoading ? <LoadingAnimation /> : 'Reset Password'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
         
          >
            Didn't receive OTP? Resend
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-700 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
