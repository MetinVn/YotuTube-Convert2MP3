import React, { useState, useRef, useEffect, useCallback, useContext, useReducer } from "react";
import { FiPlay, FiPause, FiVolume2, FiRepeat } from "react-icons/fi";

import { Slide, toast, ToastContainer } from "react-toastify";

import Input from "../components/Inputfield";
import Button from "../components/Button";
import ResultLink from "../components/ResultLink";
import LoadingAnimation from "../components/LoadingAnimation";

import { MP3Context } from "../contexts/MP3Context";
import { formatFileSize } from "../utils/FormatFileSize";
import { refreshMP3Link } from "../utils/RefreshLink";
import { deleteMP3 } from "../database/music/deleteMP3";
import { UserContext } from "../contexts/UserContext";
import FloatingMP3Displayer from "../components/FloatingMP3Player";
import AudioPlayer from "../components/MusicPlayer";

const MP3Player = () => {
  const { mp3List, setMP3List, loading } = useContext(MP3Context);
  const { authUser, loadingUser } = useContext(UserContext);

  const initialState = {
    floatingPlayer: false,
    playingIndex: null,
    loopingStates: {},
    refreshingItem: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_FLOATING_PLAYER":
        return { ...state, floatingPlayer: action.payload };
      case "SET_PLAYING_INDEX":
        return { ...state, playingIndex: action.payload };
      case "SET_LOOPING_STATES":
        return { ...state, loopingStates: action.payload };
      case "SET_REFRESHING_ITEM":
        return { ...state, refreshingItem: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const [mp3Object, setMP3Object] = useState({
    volumes: {},
    progresses: {},
    tooltips: {},
  });

  const [durations, setDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const audioRefs = useRef([]);
  const refs = audioRefs.current;
  const isAudioPlaying = refs[state.playingIndex]?.paused;
  const filteredMP3s = Object.keys(mp3List).filter((key) =>
    mp3List[key].title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFloatingPlayer = useCallback((index) => {
    dispatch({ type: "SET_FLOATING_PLAYER", payload: !state.floatingPlayer });
    dispatch({ type: "SET_PLAYING_INDEX", payload: index });
  });

  const handlePlayPause = (index) => {
    const audioRef = refs[index];
    if (audioRef.paused) {
      audioRef.play();
    } else {
      audioRef.pause();
    }
    dispatch({ type: "SET_PLAYING_INDEX", payload: index });
  };

  const handleNextTrack = useCallback(() => {
    if (filteredMP3s.length > 0) {
      const nextIndex = (state.playingIndex + 1) % filteredMP3s.length;
      dispatch({ type: "SET_PLAYING_INDEX", payload: nextIndex });
    }
  }, [state.playingIndex, filteredMP3s]);

  const handlePreviousTrack = useCallback(() => {
    if (filteredMP3s.length > 0) {
      const prevIndex = (state.playingIndex - 1 + filteredMP3s.length) % filteredMP3s.length;
      dispatch({ type: "SET_PLAYING_INDEX", payload: prevIndex });
    }
  }, [state.playingIndex, filteredMP3s]);

  const handleVolumeChange = useCallback(
    (e, index) => {
      const newVolume = e.target.value;
      setMP3Object((prev) => ({
        ...prev,
        volumes: {
          ...prev.volumes,
          [index]: newVolume,
        },
      }));
      if (refs[index]) {
        refs[index].volume = newVolume;
      }
    },
    [refs]
  );

  const handleProgressChange = useCallback((e, index) => {
    const newTime = (e.target.value / 100) * (refs[index]?.duration || 0);

    if (isFinite(newTime) && refs[index] && refs[index].currentTime !== newTime) {
      refs[index].currentTime = newTime;

      setMP3Object((prev) => {
        if (prev.progresses[index] === e.target.value) {
          return prev;
        }
        return {
          ...prev,
          progresses: {
            ...prev.progresses,
            [index]: e.target.value,
          },
        };
      });
    }
  }, []);

  const toggleLoop = (index) => {
    const title = mp3List[index]?.title;
    const newLoopingState = !state.loopingStates[index];
    dispatch({
      type: "SET_LOOPING_STATES",
      payload: {
        ...state.loopingStates,
        [index]: newLoopingState,
      },
    });
    toast.dark(newLoopingState ? "Looping enabled for: " + title : "Looping disabled for: " + title);
  };

  const formatDuration = (duration) => {
    if (!isFinite(duration)) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleProgressMouseMove = useCallback((e, index) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    const duration = refs[index]?.duration || 0;
    const currentTime = (percentage / 100) * duration;
    setMP3Object((prev) => ({
      ...prev,
      tooltips: {
        ...prev.tooltips,
        [index]: {
          visible: true,
          x: e.clientX - rect.left + progressBar.offsetLeft,
          y: e.clientY - rect.top - 40,
          time: formatDuration(currentTime),
        },
      },
    }));
  });

  const handleProgressMouseLeave = (index) => {
    setMP3Object((prev) => ({
      ...prev,
      tooltips: { ...prev.tooltips, [index]: { visible: false } },
    }));
  };

  const handleProgressTouchMove = (e, index) => {
    const touch = e.touches[0];
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    const duration = refs[index]?.duration || 0;
    const currentTime = (percentage / 100) * duration;
    setMP3Object((prev) => ({
      ...prev,
      tooltips: {
        ...prev.tooltips,
        [index]: {
          visible: true,
          x: touch.clientX - rect.left + progressBar.offsetLeft,
          y: touch.clientY - rect.top - 40,
          time: formatDuration(currentTime),
        },
      },
    }));
  };

  const handleProgressTouchEnd = (index) => {
    setMP3Object((prev) => ({
      ...prev,
      tooltips: { ...prev.tooltips, [index]: { visible: false } },
    }));
  };

  const defineDurations = useCallback(() => {
    refs.forEach((audio, index) => {
      if (audio) {
        setDurations((prev) => ({
          ...prev,
          [index]: audio.duration,
        }));
      }
    });
  }, [refs, mp3List]);

  useEffect(() => {
    defineDurations();
  }, [refs, mp3List]);

  useEffect(() => {
    const updateProgress = (index) => {
      if (refs[index] && isFinite(refs[index].duration)) {
        const progressPercentage = (refs[index].currentTime / refs[index].duration) * 100;
        setMP3Object((prev) => ({
          ...prev,
          progresses: {
            ...prev.progresses,
            [index]: isFinite(progressPercentage) ? progressPercentage : 0,
          },
        }));
      }
    };

    refs.forEach((audio, index) => {
      if (audio) {
        const handleTimeUpdate = () => updateProgress(index);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        const handleEnded = () => {
          if (state.loopingStates[index]) {
            audio.currentTime = 0;
            audio.play();
          }
        };
        audio.addEventListener("ended", handleEnded);

        return () => {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.removeEventListener("ended", handleEnded);
        };
      }
    });
  }, [refs, state.playingIndex, state.loopingStates]);

  useEffect(() => {
    const playAudio = async () => {
      if (state.playingIndex !== null && refs[state.playingIndex]) {
        try {
          await refs[state.playingIndex].play();
        } catch (error) {
          toast.error("Playback failed. Try refreshing the link.");
        }
      }

      refs.forEach((audio, index) => {
        if (audio && index !== state.playingIndex) {
          audio.pause();
        }
      });
    };

    playAudio();
  }, [state.playingIndex]);

  const handleRefreshLink = async (mp3Item) => {
    dispatch({ type: "SET_REFRESHING_ITEM", payload: mp3Item.url });
    try {
      await refreshMP3Link(mp3Item.url, mp3Item.youtubeID, setMP3List, toast, mp3Item.fileSize, authUser, loadingUser);
    } catch (error) {
      console.error("Error refreshing the link:", error);
    } finally {
      dispatch({ type: "SET_REFRESHING_ITEM", payload: null });
    }
  };

  const handleDeleteItem = async (key, toast) => {
    if (authUser) {
      await deleteMP3(authUser, key, toast);
      setMP3List((prevMp3List) => {
        const newMp3List = prevMp3List.filter((item) => item.youtubeID !== key);
        return newMp3List;
      });
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

  // Play and Pause Button
  const PlayButton = ({ isPlaying, onClick }) => (
    <Button
      aria_label="Play&Pause"
      children={
        isPlaying ? (
          <FiPlay className="stroke-gray-400" size={20} />
        ) : (
          <FiPause className="stroke-green-400" size={20} />
        )
      }
      onClick={onClick}
      className="p-2 rounded-full bg-transparent hover:bg-[#777]"
    />
  );

  // Song Title and Link
  const SongTitleLink = ({ title, url, youtubeURL }) => (
    <ResultLink className="text-sm sm:text-xl" target="_blank" url={youtubeURL} href={url} title={title} />
  );

  // Action Buttons (Refresh, Delete, Floating Player Toggle)
  const ActionButtons = ({ onRefresh, onDelete, onToggleFloatingPlayer }) => (
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
      <Button
        aria_label="Toggle Floating Player"
        children="Toggle Floating Player"
        onClick={onToggleFloatingPlayer}
        className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base bg-green-500 text-white rounded hover:bg-green-700"
      />
    </div>
  );

  // Progress Bar with Tooltip
  const ProgressBar = ({ progress, onChange, onHover, tooltip }) => (
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
        onMouseMove={onHover}
      />
      {tooltip?.visible && <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y }}>{tooltip.time}</div>}
    </div>
  );

  // Loop and Volume Control
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

  return (
    <div className="bg-[#1E1E1E] pt-20 px-2 sm:px-6 py-14 sm:py-8">
      <ToastContainer stacked position="bottom-right" transition={Slide} limit={8} />
      {/* Fixed Header */}
      <div className="bg-[#1E1E1E] p-4 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-white ">Music Player</h1>

        <Input
          type="search"
          placeholder="Search for a song"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-4 text-white bg-[#333] border-[#444] rounded w-full max-w-[600px] p-2"
        />
      </div>

      {loading ? (
        loadingScreen
      ) : Object.keys(mp3List).length === 0 ? (
        noMp3ListMessage
      ) : Object.keys(filteredMP3s).length == 0 ? (
        noResultsMessage
      ) : (
        <ul className="space-y-4 sm:space-y-6 text-ssm max-w-[1000px] w-full min-h-screen mx-auto">
          {filteredMP3s.map((key, index) => {
            const currentTrack = mp3List[key];
            const audioRef = refs[index];
            const isCurrentTrackPlaying = audioRef?.paused;
            const isCurrentTrackLooping = state.loopingStates[index] || false;
            const duration = formatDuration(durations[index] || 0);
            const isRefreshing = state.refreshingItem === currentTrack.url;

            return (
              <li
                key={key}
                className={` ${isRefreshing ? "cursor-wait" : "cursor-default"} p-3 sm:p-6 border rounded-lg ${
                  isCurrentTrackPlaying ? "bg-[#333] border-[#444]" : "bg-[#494949] border-[#4ada31]"
                } shadow-md transition-colors duration-300 max-w-full`}>
                {isRefreshing ? (
                  <LoadingAnimation />
                ) : (
                  <div className="flex flex-col items-center space-y-2 sm:space-y-4 w-full max-w-[1000px] mx-auto">
                    <div className="flex flex-col justify-start items-start text-start w-full space-y-3">
                      <div className="flex items-center w-full">
                        <PlayButton isPlaying={isCurrentTrackPlaying} onClick={() => handlePlayPause(index)} />
                        <SongTitleLink
                          title={currentTrack.title}
                          url={currentTrack.url}
                          youtubeURL={currentTrack.youtubeURL}
                        />
                      </div>
                      <div className="flex justify-between w-full space-x-4">
                        <ActionButtons
                          onRefresh={() => handleRefreshLink(currentTrack)}
                          onDelete={() => handleDeleteItem(currentTrack, toast)}
                          onToggleFloatingPlayer={() => handleFloatingPlayer(index)}
                        />
                      </div>
                      <p className="text-sm text-gray-400 whitespace-nowrap">Duration: {duration}</p>
                    </div>
                    <ProgressBar
                      progress={mp3Object.progresses[index] || 0}
                      onChange={(e) => handleProgressChange(e, index)}
                      onHover={(e) => handleProgressMouseMove(e, index)}
                      tooltip={mp3Object.tooltips[index]}
                    />
                    <LoopAndVolumeControls
                      isLooping={isCurrentTrackLooping}
                      onLoopToggle={() => toggleLoop(index)}
                      volume={mp3Object.volumes[index] || 0.5}
                      onVolumeChange={(e) => handleVolumeChange(e, index)}
                      fileSize={formatFileSize(mp3List[key].fileSize)}
                    />
                    <AudioPlayer
                      track={currentTrack}
                      index={index}
                      onLoadedMetadata={() => {
                        /* Handle metadata if needed */
                      }}
                      onPlay={() => {
                        /* Handle play event if needed */
                      }}
                      onPause={() => {
                        /* Handle pause event if needed */
                      }}
                      isPlaying={isCurrentTrackPlaying}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div>
        {state.floatingPlayer && (
          <FloatingMP3Displayer
            title={mp3List[state.playingIndex]?.title || "Track name"}
            isPlaying={isAudioPlaying}
            onPlay={() => handlePlayPause(state.playingIndex)}
            onPause={() => handlePlayPause(state.playingIndex)}
            onNext={handleNextTrack}
            onPrevious={handlePreviousTrack}
            onClosePlayer={() => handleFloatingPlayer(state.playingIndex)}
            onVolumeChange={(e) => handleVolumeChange(e, state.playingIndex)}
            currentVolume={mp3Object.volumes[state.playingIndex] || 1}
          />
        )}
      </div>
    </div>
  );
};

export default MP3Player;
