import React, { useState, useEffect, useContext } from "react";
import { updateUserProfile, changePassword } from "../firebaseAuth";
import Input from "../components/Inputfield";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import PageFallback from "../components/PageFallback";

const EditProfile = () => {
  const { authUser, loadingUser, isLoggedIn } = useContext(UserContext);
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && authUser) {
      setInitialDisplayName(authUser.displayName || "");
      setDisplayName(authUser.displayName || "");
    }
  }, [loadingUser, authUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (displayName.trim() !== initialDisplayName && displayName.trim() === displayName) {
        await updateUserProfile(displayName);
        setSuccess("Profile updated successfully!");
      } else {
        setError("Display name is either unchanged or contains leading/trailing spaces.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword === newPassword) {
      toast.info("New password cannot be the same as the old one.");
      return new Error("New password cannot be the same as the old one");
    }
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/YotuTube-Convert2MP3/account");
  };

  const isSaveButtonDisabled = !displayName || displayName === initialDisplayName;

  if (loadingUser) {
    return <PageFallback />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] transition-colors duration-300">
        <p className="text-lg text-white">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white py-28 px-6">
      <div className="max-w-lg mx-auto p-8 bg-[#2C2C2C] rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        {error && <p className="mb-4 text-red-500">{error}</p>}
        {success && <p className="mb-4 text-green-500">{success}</p>}

        {/* Display Name Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-lg font-medium mb-2">
              Display Name
            </label>
            <Input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white"
              placeholder="Enter your display name"
              required
            />
          </div>
          <Button
            aria_label={isSaveButtonDisabled ? "Disabled Save Display Name" : "Save Display Name"}
            disabled={isSaveButtonDisabled}
            children="Save Display Name"
            type="submit"
            className="w-full px-4 py-3 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C] transition-colors duration-300"
          />
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-10">
          <div>
            <label htmlFor="currentPassword" className="block text-lg font-medium mb-2">
              Current Password
            </label>
            <Input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium mb-2">
              New Password
            </label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              aria_label="Change Password"
              children="Change Password"
              type="submit"
              className="px-4 py-3 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C] transition-colors duration-300"
            />
            <Link to="/YotuTube-Convert2MP3/reset-password" title="Reset password">
              <span className="hover:underline text-sm text-gray-300">Forgot password?</span>
            </Link>
          </div>
        </form>

        <Button
          aria_label="Cancel"
          children="Cancel"
          onClick={handleCancel}
          className="mt-8 w-full px-4 py-3 bg-gray-600 text-red-400 rounded-md hover:bg-gray-700 transition-colors duration-300"
        />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default EditProfile;
