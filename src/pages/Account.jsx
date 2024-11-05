import { useNavigate } from "react-router-dom";
import { signOutUser } from "../firebaseAuth";
import Button from "../components/Button";
import profileImage from "../images/avatar.avif";
import LoadingAnimation from "../components/LoadingAnimation";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { MP3Context } from "../contexts/MP3Context";

const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, loadingUser } = useContext(UserContext);
  const { loading, mp3List } = useContext(MP3Context);

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
      <div className="max-w-4xl mx-auto p-6 sm:p-10 mt-20 bg-[#2C2C2C] shadow-lg rounded-lg border border-[#4CAF50]">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
            <img
              src={profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-gray-700"
            />
            <div className="mt-4 sm:mt-0 flex-1">
              <h2 className="text-3xl font-bold text-white">{authUser?.displayName || "User Name"}</h2>
              <p className="text-lg text-gray-400 mt-2">
                Member since: <span className=" text-gray-300">{joinDate}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <div className="text-lg text-gray-300 text-start flex-1 flex  gap-1 sm:gap-3">
                <span className=" text-gray-400">Email:</span>
                <span className="text-white">{authUser?.email || "example@example.com"}</span>
              </div>
            </div>
          </div>

          {/* MP3 List */}
          <div className="space-y-4 mt-6">
            <div className="text-lg text-gray-300 flex flex-col">
              <div className="flex-1 space-x-1">
                <span className="font-semibold text-gray-400">MP3 List:</span>
                <span className="text-white">
                  {!loading && mp3List.length > 0 ? `${mp3List.length} tracks` : "No tracks available"}
                </span>
              </div>
              <p className="text-gray-400 mt-1">Here you can see all your saved MP3 files.</p>
              <ul className="mt-2 space-y-1">
                {mp3List.map((mp3, index) => (
                  <li className="text-sm text-white bg-[#333] p-2 rounded-md" key={index}>
                    {mp3.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-8">
            <Button
              aria_label="Log out"
              type="button"
              onClick={handleLogout}
              children="Log out"
              className="px-4 py-2 mb-4 sm:mb-0 sm:w-auto w-full bg-[#FF5252] text-white rounded hover:bg-[#E04848] transition duration-300"
            />
            <Button
              aria_label="Edit profile"
              type="button"
              onClick={() => navigate("/YotuTube-Convert2MP3/account/edit")}
              children="Edit profile"
              className="px-4 py-2 sm:w-auto w-full bg-[#4CAF50] text-white rounded hover:bg-[#388E3C] transition duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
