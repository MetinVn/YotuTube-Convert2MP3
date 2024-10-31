import React, { useContext, useEffect, useState } from "react";
import { debounce } from "lodash";

import { toast } from "react-toastify";

import Input from "../components/Inputfield";
import Button from "../components/Button";
import ResultLink from "../components/ResultLink";
import LoadingAnimation from "../components/LoadingAnimation";

import { formatFileSize } from "../utils/formatFileSize";
import { refreshMP3Link } from "../utils/RefreshLink";

import { MP3Context } from "../contexts/MP3Context";

import { deleteMP3 } from "../database/music/deleteMP3";
import { DeleteMP3 } from "../database/music/deleteMP3Storage";

const ConvertedMusic = () => {
  const { setMP3List, mp3List, loading, setLoading } = useContext(MP3Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMP3s, setFilteredMP3s] = useState(mp3List);
  const [refreshingItem, setRefreshingItem] = useState(null);

  const handleSearch = debounce((term) => {
    setLoading(true);

    if (term.trim() === "") {
      setFilteredMP3s(mp3List);
    } else {
      const filtered = Object.keys(mp3List).reduce((acc, key) => {
        if (mp3List[key].title.toLowerCase().includes(term.toLowerCase())) {
          acc[key] = mp3List[key];
        }
        return acc;
      }, {});
      setFilteredMP3s(filtered);
    }
    setLoading(false);
  }, 300);

  useEffect(() => {
    setFilteredMP3s(mp3List);
  }, [mp3List]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleClearList = async () => {
    if (Object.keys(mp3List).length === 0) {
      console.info("The list is already empty.");
    } else {
      DeleteMP3();
      setMP3List({});
      console.info("List cleared.");
    }
  };

  const handleDeleteItem = async (key) => {
    deleteMP3(key);
    setMP3List((prevMp3List) => {
      const newMp3List = { ...prevMp3List };
      delete newMp3List[key];
      return newMp3List;
    });
  };

  const handleRefreshLink = async (mp3Item) => {
    setRefreshingItem(mp3Item.url);
    try {
      await refreshMP3Link(mp3Item.url, mp3Item.youtubeID, setMP3List, toast);
    } catch (error) {
      console.error("Error refreshing the link:", error);
    } finally {
      setRefreshingItem(null);
    }
  };

  return (
    <>
      <div className="max-w-[1550px] mt-20 mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Converted Music</h1>
        <Input
          type="search"
          placeholder="Search converted music"
          className=" mx-auto max-w-[600px] my-3 p-2 text-white bg-[#333] border-[#444]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <LoadingAnimation />
        ) : Object.keys(filteredMP3s).length === 0 ? (
          <p className="text-lg text-[#ccc]">
            {searchTerm.trim() === ""
              ? "The list is empty. Convert a URL to add it here automatically."
              : "No results found. Try a different search term."}
          </p>
        ) : (
          <ul className="space-y-3 text-sm overflow-hidden max-w-full">
            {Object.keys(filteredMP3s).map((key) => {
              const item = filteredMP3s[key];
              return (
                <li
                  key={key}
                  className={`p-2 border rounded bg-[#333] border-[#444] w-full max-w-full ${
                    refreshingItem === item.url ? "opacity-50" : ""
                  }`}>
                  {refreshingItem === item.url ? (
                    <LoadingAnimation />
                  ) : (
                    <>
                      <ResultLink target="_self" url={item.youtubeURL} href={item.url} title={item.title} />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 space-y-2 sm:space-y-0">
                        <div className="flex space-x-3">
                          <Button
                            aria_label="Delete item"
                            type="button"
                            children="Delete"
                            onClick={() => handleDeleteItem(key)}
                            className="py-[4px] bg-[#555] text-[#FF5252] hover:bg-[#777]"
                          />
                          <Button
                            aria_label="Refresh item"
                            type="button"
                            children="Refresh Link"
                            onClick={() => handleRefreshLink(item)}
                            className={`py-[4px] bg-[#555] text-[#4ecb52] hover:bg-[#777] ${
                              refreshingItem === item.url ? "animate-pulse" : ""
                            }`}
                          />
                        </div>
                        <p className="text-gray-400 text-sm text-right">{formatFileSize(item.fileSize)}</p>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {Object.keys(filteredMP3s).length > 1 && (
          <div className="mt-4 flex justify-center">
            <Button
              children="Delete all"
              type="button"
              aria_label="Delete all items"
              onClick={handleClearList}
              className="py-[4px] bg-[#555] text-[#FF5252] hover:bg-[#777]"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConvertedMusic;
