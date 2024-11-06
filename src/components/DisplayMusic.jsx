import React, { useEffect, useState } from "react";
import Button from "./Button";
import ResultLink from "./ResultLink";
import LoadingAnimation from "./LoadingAnimation";
import { formatFileSize } from "../utils/FormatFileSize";
import { deleteMP3 } from "../database/music/deleteMP3";
import { FiPlay } from "react-icons/fi";

const DisplayMusic = ({
  authUser,
  loadingRefresh,
  refreshMP3Link,
  setCurrentMP3,
  mp3List,
  setMP3List,
  loading,
  toast,
}) => {
  const [filteredMP3s, setFilteredMP3s] = useState(mp3List);
  const [refreshingItem, setRefreshingItem] = useState(null);

  useEffect(() => {
    setFilteredMP3s(mp3List);
  }, [mp3List]);

  const handleDeleteItem = async (item) => {
    if (authUser) {
      await deleteMP3(authUser, item.youtubeID, toast, item.title);
      setMP3List((prevMp3List) => prevMp3List.filter((mp3) => mp3.youtubeID !== item.youtubeID));
    } else {
      console.error("You need to be logged in to delete this song.");
    }
  };

  const handleRefreshLink = async (mp3Item) => {
    setRefreshingItem(mp3Item.url);
    await refreshMP3Link(mp3Item);
    if (!loadingRefresh) {
      setRefreshingItem(null);
    }
  };

  const handlePlaySong = (mp3) => {
    setCurrentMP3(mp3);
  };

  return (
    <div className="max-w-[1550px] w-full mt-20 flex justify-center mx-auto">
      {loading ? (
        <LoadingAnimation />
      ) : mp3List.length === 0 ? (
        <div>No tracks found</div>
      ) : (
        <div className="w-full overflow-x-auto px-2">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Songs</h2>
          <table className="w-full text-sm bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg border-collapse">
            <thead>
              <tr className="text-gray-300 bg-[#333]">
                <th className="p-3 border-b border-gray-600 text-left">Play</th>
                <th className="p-3 border-b border-gray-600 text-left">Title</th>
                <th className="p-3 border-b border-gray-600 text-center">Actions</th>
                <th className="p-3 border-b border-gray-600 text-right hidden sm:table-cell">Size</th>
              </tr>
            </thead>
            <tbody>
              {filteredMP3s.map((item) => (
                <tr
                  key={item.youtubeID}
                  className={`${
                    refreshingItem === item.url ? "opacity-50" : "hover:bg-[#2c2c2c]"
                  } transition-colors duration-200`}>
                  <td className="p-1 sm:p-3 text-center">
                    <button
                      onClick={() => handlePlaySong(item)}
                      className="w-10 h-10 flex items-center justify-center bg-[#4ADA31] text-white rounded-full shadow hover:shadow-md hover:bg-[#38a623] transition-all duration-300">
                      <FiPlay className="text-xs sm:text-xl" />
                    </button>
                  </td>
                  <td className="p-1 sm:p-3">
                    {refreshingItem === item.url ? (
                      <LoadingAnimation />
                    ) : (
                      <ResultLink
                        url={item.youtubeURL}
                        href={item.url}
                        title={item.title}
                        className="text-xs sm:text-lg text-gray-100 hover:text-[#4ADA31] transition-colors duration-200"
                      />
                    )}
                  </td>
                  <td className="p-3 text-center table-cell">
                    <div className="flex gap-2 justify-center">
                      <Button
                        aria_label="Delete item"
                        type="button"
                        children="Delete"
                        onClick={() => handleDeleteItem(item)}
                        className="px-1 py-0 text-sm sm:py-2 sm:px-4 sm:text-base bg-[#555] text-[#FF5252] rounded-lg hover:bg-[#777] transition-all duration-200"
                      />
                      <Button
                        aria_label="Refresh item"
                        type="button"
                        children="Refresh Link"
                        onClick={() => handleRefreshLink(item)}
                        className={`px-1 py-0 text-sm sm:py-2 sm:px-4 sm:text-base bg-[#555] text-[#4ecb52] rounded-lg hover:bg-[#777] transition-all duration-200 ${
                          refreshingItem === item.url ? "animate-pulse" : ""
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-3 text-gray-400 text-right hidden sm:table-cell">{formatFileSize(item.fileSize)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayMusic;
