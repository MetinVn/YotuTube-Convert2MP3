import React from "react";
import { Link } from "react-router-dom";

const CreditsPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center py-10">
      <h1 className="text-5xl sm:text-4xl font-bold mb-8 text-[#4CAF50] ">Credits</h1>

      <p className="text-xl sm:text-lg text-gray-300 mb-8 text-center max-w-2xl ">
        This application makes use of the following resources. Thank you to their creators for providing such valuable
        work!
      </p>

      <div className="bg-[#333] p-6 rounded-lg shadow-lg max-w-xl w-[90%] ">
        <ul className="space-y-4">
          <li>
            <Link
              to="https://www.flaticon.com/free-icons/convert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4CAF50] hover:underline text-xl ">
              Flaticon - Convert Icons
            </Link>
            <p className="text-gray-400 text-sm">Icons used for tab icon.</p>
          </li>
          <li>
            <Link
              to="https://rapidapi.com/ytjar/api/youtube-video-download-info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4CAF50] hover:underline text-xl ">
              RapidAPI - YouTube Video Download Info
            </Link>
            <p className="text-gray-400 text-sm">Used for converting YouTube links to MP3 and MP4 formats.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreditsPage;
