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
      if (displayName.trim() === displayName && displayName !== initialDisplayName) {
        await updateUserProfile(displayName);
        setSuccess("Profile updated successfully!");
      } else {
        setError("Display name contains leading or trailing spaces, or it's the same as the current one.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword.trim() === newPassword.trim()) {
      toast.info("New password can't be the same as the old one.");
      return new Error("New password can't be the same as the old one");
    } else {
      try {
        await changePassword(currentPassword, newPassword);
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleCancel = () => {
    navigate("/YotuTube-Convert2MP3/account");
  };

  const isSaveButtonDisabled = !displayName || displayName === initialDisplayName;

  // Show loading state while user data is being fetched
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
    <div className="min-h-screen bg-[#1E1E1E] transition-colors duration-300 p-6">
      <div className="max-w-screen-lg mx-auto p-6 pt-20">
        <h1 className="text-4xl font-bold text-white mb-6">Edit Your Profile</h1>
        {error && <p className="mb-4 text-red-400">{error}</p>}
        {success && <p className="mb-4 text-[#4CAF50]">{success}</p>}

        {/* Display Name Form */}
        <form onSubmit={handleProfileSubmit} className="flex flex-col">
          <div>
            <label htmlFor="displayName" className="block text-lg font-semibold text-white mb-2">
              Display Name
            </label>
            <Input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 mb-4 bg-[#444] border border-[#555] text-white"
              placeholder="Enter your display name"
              required
            />
          </div>
          <Button
            aria_label={isSaveButtonDisabled ? "Disabled Save Display Name" : "Save Display Name"}
            disabled={isSaveButtonDisabled}
            children="Save Display Name"
            type="submit"
            className="self-start px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#388E3C] transition-colors duration-300"
          />
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6 mt-8">
          <div>
            <label htmlFor="currentPassword" className="block text-lg font-semibold text-white mb-2">
              Current Password
            </label>
            <Input
              password={true}
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 bg-[#444] border border-[#555] text-white "
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-lg font-semibold text-[#333333] dark:text-white mb-2">
              New Password
            </label>
            <Input
              password={true}
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 bg-[#444] border border-[#555] text-white"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria_label="Change Password"
              children="Change Password"
              type="submit"
              className="self-start px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#388E3C] transition-colors duration-300"
            />
            <Link to="/YotuTube-Convert2MP3/reset-password" title="Reset password">
              <span className="dark:text-white hover:underline">Forgot password?</span>
            </Link>
          </div>
        </form>

        <Button
          aria_label="Cancel"
          children="Cancel"
          onClick={handleCancel}
          className="mt-6 px-4 py-2 rounded bg-[#555] text-[#FF5252] hover:bg-[#777]"
        />
      </div>
      <ToastContainer stacked position="bottom-right" />
    </div>
  );
};

export default EditProfile;
