import { useNavigate } from "react-router-dom";
import { signOutUser } from "../firebaseAuth";
import Button from "../components/Button";
import profileImage from "../images/avatar.avif";
import LoadingAnimation from "../components/LoadingAnimation";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, loadingUser } = useContext(UserContext);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] transition-colors duration-300">
        <LoadingAnimation />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] transition-colors duration-300">
        <p className="text-lg text-white">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/YotuTube-Convert2MP3/");
    } catch (error) {
      console.error("Failed to log out. Please try again.", error);
    }
  };

  const joinDate = new Date(authUser?.metadata.creationTime).toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#1E1E1E] transition-all duration-300 p-6">
      <div className="max-w-4xl mx-auto p-3 sm:p-10 mt-20 bg-[#2C2C2C] shadow-2xl rounded-lg border border-[#4CAF50]">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <img
              src={profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-gray-700"
            />
            <div className="flex flex-col space-y-1">
              <h2 className="text-2xl font-bold text-white">{authUser?.displayName || "User Name"}</h2>
              <p className="text-lg text-gray-300">
                Member since: <span className="font-semibold">{joinDate}</span>
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <p className="text-lg text-gray-300">
                Email:
                <span className="font-semibold ml-2 text-white">{authUser?.email}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button
              aria_label="Log out"
              type="button"
              onClick={handleLogout}
              children="Log out"
              className="px-4 py-2 bg-[#555] text-[#FF5252] hover:bg-[#777]"
            />
            <Button
              aria_label="Edit profile"
              type="button"
              onClick={() => navigate("/YotuTube-Convert2MP3/account/edit")}
              children="Edit profile"
              className="px-4 py-2 bg-[#4CAF50] text-white hover:bg-[#388E3C]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
