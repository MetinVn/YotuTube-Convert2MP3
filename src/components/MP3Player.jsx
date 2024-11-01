import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from "react";
import { FiPlay, FiPause, FiVolume2, FiRepeat } from "react-icons/fi";
import { Slide, toast, ToastContainer } from "react-toastify";

import Input from "./Inputfield";
import Button from "./Button";
import ResultLink from "./ResultLink";
import LoadingAnimation from "./LoadingAnimation";

import { MP3Context } from "../contexts/MP3Context";
import { formatFileSize } from "../utils/FormatFileSize";
import { refreshMP3Link } from "../utils/RefreshLink";
import { deleteMP3 } from "../database/music/deleteMP3";
import { UserContext } from "../contexts/UserContext";

const MP3Player = () => {
  const { mp3List, setMP3List, loading } = useContext(MP3Context);
  const { authUser, loadingUser } = useContext(UserContext);
  const [loopingStates, setLoopingStates] = useState({});
  const [refreshingItem, setRefreshingItem] = useState(null);
  const [mp3Object, setMP3Object] = useState({ volumes: {}, progresses: {}, tooltips: {} });
  const [durations, setDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const audioRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handlePlayPause = useCallback(
    (index) => {
      const audioRef = audioRefs.current[index];
      if (activeIndex !== null && activeIndex !== index) {
        audioRefs.current[activeIndex]?.pause();
      }

      if (audioRef?.paused) {
        audioRef?.play();
        setActiveIndex(index);
      } else {
        audioRef?.pause();
        setActiveIndex(null);
      }
    },
    [activeIndex]
  );

  const handleProgressChange = useCallback((e, index) => {
    const audioElement = audioRefs.current[index];
    if (audioElement) {
      const newTime = (e.target.value / 100) * audioElement.duration;
      audioElement.currentTime = newTime;

      setMP3Object((prev) => ({
        ...prev,
        progresses: {
          ...prev.progresses,
          [index]: e.target.value,
        },
      }));
    }
  }, []);

  const handleVolumeChange = useCallback((e, index) => {
    const newVolume = e.target.value;
    setMP3Object((prev) => ({
      ...prev,
      volumes: {
        ...prev.volumes,
        [index]: newVolume,
      },
    }));
    audioRefs.current[index].volume = newVolume;
  }, []);

  const updateProgress = useCallback((index) => {
    const audioElement = audioRefs.current[index];
    if (audioElement) {
      setMP3Object((prev) => ({
        ...prev,
        progresses: {
          ...prev.progresses,
          [index]: (audioElement.currentTime / audioElement.duration) * 100,
        },
      }));
    }
  }, []);

  useEffect(() => {
    mp3List.forEach((_, index) => {
      const audioElement = audioRefs.current[index];
      if (audioElement) {
        const handleTimeUpdate = () => updateProgress(index);
        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        return () => audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    });
  }, [mp3List, updateProgress]);

  useEffect(() => {
    if (activeIndex !== null) {
      const playAudio = async () => {
        try {
          await audioRefs.current[activeIndex].play();
        } catch (error) {
          toast.error("Playback failed. Try refreshing the link.");
        }
        audioRefs.current.forEach((audio, index) => {
          if (audio && index !== activeIndex) {
            audio.pause();
          }
        });
      };
      playAudio();
    }
  }, [activeIndex]);

  const updateDuration = useCallback(
    (index) => {
      const audio = audioRefs.current[index];
      if (audio && isFinite(audio.duration)) {
        setDurations((prev) => ({
          ...prev,
          [index]: audio.duration,
        }));
      }
    },
    [audioRefs.current]
  );

  const toggleLoop = useCallback(
    (index) => {
      const title = mp3List[index]?.title;
      const newLoopingState = !loopingStates[index];

      setLoopingStates((prev) => ({
        ...prev,
        [index]: newLoopingState,
      }));

      const audio = audioRefs.current[index];
      if (audio) {
        audio.loop = newLoopingState;
      }

      toast.dark(
        newLoopingState ? `Looping enabled for: ${title || "music"}` : `Looping disabled for: ${title || "music"}`
      );
    },
    [loopingStates, mp3List]
  );

  const formatDuration = useCallback((duration) => {
    if (!isFinite(duration)) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  const handleRefreshLink = async (mp3Item) => {
    setRefreshingItem(mp3Item.url);
    try {
      await refreshMP3Link(mp3Item.url, mp3Item.youtubeID, setMP3List, toast, mp3Item.fileSize, authUser, loadingUser);
    } catch (error) {
      console.error("Error refreshing the link:", error);
    } finally {
      setRefreshingItem(null);
    }
  };

  const handleDeleteItem = async (key) => {
    if (authUser) {
      await deleteMP3(authUser, key.youtubeID, toast, key.title);
      setMP3List((prevMp3List) => prevMp3List.filter((item) => item.youtubeID !== key.youtubeID));
    } else {
      toast.error("You need to be logged in to delete this song.");
    }
  };

  const loadingScreen = (
    <div className="flex min-h-screen">
      <section className="flex-grow">
        <LoadingAnimation />
      </section>
    </div>
  );

  const noMp3ListMessage = (
    <p className="text-lg text-center text-gray-300 h-screen">Convert any music to be able to listen to it here.</p>
  );

  const noResultsMessage = (
    <p className="text-lg text-center text-gray-300 h-screen">
      No music matches your search. Try being more case-sensitive.
    </p>
  );

  const PlayButton = ({ isPlaying, onClick }) => (
    <Button
      aria_label="Play&Pause"
      children={
        isPlaying ? (
          <FiPause className="stroke-green-400" size={20} />
        ) : (
          <FiPlay className="stroke-gray-400 " size={20} />
        )
      }
      onClick={onClick}
      className="p-2 rounded-full bg-transparent hover:bg-[#777]"
    />
  );

  const ActionButtons = ({ onRefresh, onDelete }) => (
    <div className="flex space-x-1 sm:space-x-4">
      <Button
        aria_label="Refresh item"
        children="Refresh Link"
        onClick={onRefresh}
        className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base bg-[#555] text-[#4ecb52] hover:bg-[#777]"
      />
      <Button
        aria_label="Delete item"
        children="Delete item"
        onClick={onDelete}
        className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base bg-[#555] text-[#FF5252] hover:bg-[#777]"
      />
    </div>
  );

  const ProgressBar = ({ progress, onChange }) => (
    <div className="relative w-full h-2 bg-gray-600 rounded-full max-w-[1000px]">
      <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
      <input
        type="range"
        min="0"
        max="100"
        className="absolute top-0 left-0 w-full h-2 appearance-none cursor-pointer bg-transparent z-10"
        style={{ opacity: 0 }}
        value={progress}
        onChange={onChange}
      />
    </div>
  );

  const LoopAndVolumeControls = ({ isLooping, onLoopToggle, volume, onVolumeChange, fileSize }) => (
    <div className="flex items-center space-x-4 w-full">
      <Button
        aria_label="Repeat"
        children={<FiRepeat className={isLooping ? "stroke-green-400" : "stroke-gray-400"} size={20} />}
        onClick={onLoopToggle}
        className="p-3 rounded-full bg-transparent hover:bg-[#777]"
      />
      <div className="flex items-center m-0 w-full space-x-3 max-w-[400px]">
        <FiVolume2 className="stroke-green-400" size={35} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="h-2 w-full rounded-lg cursor-pointer accent-green-500"
        />
        <p className="text-gray-400 text-sm text-right whitespace-nowrap">File size: {fileSize}</p>
      </div>
    </div>
  );

  const renderTrack = useCallback(
    (key, index) => {
      const isCurrentTrackPlaying = index === activeIndex;
      const isRefreshing = refreshingItem === key.url;
      const duration = formatDuration(durations[index] || 0);

      return (
        <li
          key={index}
          className={` ${isRefreshing ? "cursor-wait" : "cursor-default"} p-3 sm:p-6 border rounded-lg ${
            isCurrentTrackPlaying ? "bg-[#494949] border-[#4ada31]" : "bg-[#333] border-[#444]"
          } shadow-md transition-colors duration-300 max-w-full`}>
          {isRefreshing ? (
            <LoadingAnimation />
          ) : (
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 w-full max-w-[1000px] mx-auto">
              <div className="flex flex-col justify-start items-start text-start w-full space-y-3">
                <div className="flex items-center w-full">
                  <PlayButton isPlaying={isCurrentTrackPlaying} onClick={() => handlePlayPause(index)} />
                  <ResultLink
                    className="text-sm sm:text-xl"
                    target="_blank"
                    url={key.youtubeURL}
                    href={key.url}
                    title={key.title}
                  />
                </div>
                <div className="flex justify-between w-full space-x-4">
                  <ActionButtons onRefresh={() => handleRefreshLink(key)} onDelete={() => handleDeleteItem(key)} />
                </div>
                <p className="text-sm text-gray-400 whitespace-nowrap">Duration: {duration}</p>
              </div>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={key.url}
                preload="metadata"
                onLoadedMetadata={() => updateDuration(index)}
              />
              {/* ProgressBar and LoopAndVolumeControls rendered here */}
              <ProgressBar
                progress={mp3Object.progresses[index] || 0}
                onChange={(e) => handleProgressChange(e, index)}
              />
              <LoopAndVolumeControls
                isLooping={loopingStates[index] || false}
                onLoopToggle={() => toggleLoop(index)}
                volume={mp3Object.volumes[index] || 0.5}
                onVolumeChange={(e) => handleVolumeChange(e, index)}
                fileSize={formatFileSize(key.fileSize)}
              />
            </div>
          )}
        </li>
      );
    },
    [
      activeIndex,
      mp3Object,
      handlePlayPause,
      handleRefreshLink,
      handleDeleteItem,
      toggleLoop,
      handleVolumeChange,
      handleProgressChange,
    ]
  );

  const trackList = useMemo(
    () => (
      <ul className="space-y-4 sm:space-y-6 text-ssm max-w-[1000px] w-full min-h-screen mx-auto">
        {mp3List.map((key, index) => renderTrack(key, index))}
      </ul>
    ),
    [mp3List, renderTrack]
  );

  return (
    <div className="bg-[#1E1E1E] pt-20 px-2 sm:px-6 py-14 sm:py-8">
      <ToastContainer stacked position="bottom-right" transition={Slide} limit={8} />
      <div className="bg-[#1E1E1E] p-4 flex justify-center items-center space-x-8">
        <h1 className="text-2xl font-bold text-white ">
          <span>{mp3List.length}</span> Songs
        </h1>
        <Input
          type="search"
          placeholder="Search for a song"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-4 text-white bg-[#333] border-[#444] rounded w-full max-w-[600px] p-2"
        />
      </div>
      {loading && loadingScreen}
      {mp3List.length === 0 && noMp3ListMessage}
      {trackList}
    </div>
  );
};

export default MP3Player;
