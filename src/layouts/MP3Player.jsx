import { useState, useRef, useEffect, useCallback, useContext, useReducer } from "react";
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

const MP3Player = () => {
  const initialState = {
    floatingPlayer: false,
    playingIndex: null,
    loopingStates: {},
    volumes: {},
    progresses: {},
    tooltips: {},
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
      case "SET_VOLUME_STATES":
        return { ...state, volumes: action.payload };
      case "SET_PROGRESS_STATES":
        return { ...state, progresses: action.payload };
      case "SET_TOOLTIP_STATES":
        return { ...state, tooltips: action.payload };
      case "SET_REFRESHING_ITEM":
        return { ...state, refreshingItem: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const [durations, setDurations] = useState({});
  const [tooltips, setTooltips] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const audioRefs = useRef([]);
  const refs = audioRefs.current;
  const isAudioPlaying = refs[state.playingIndex]?.paused;

  const { mp3List, setMP3List, loading } = useContext(MP3Context);
  const { authUser, loadingUser } = useContext(UserContext);

  const filteredMP3s = Object.keys(mp3List).filter((key) =>
    mp3List[key].title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFloatingPlayer = useCallback((index) => {
    dispatch({ type: "SET_FLOATING_PLAYER", payload: !state.floatingPlayer });
    dispatch({ type: "SET_PLAYING_INDEX", payload: index });
  });
  const handlePlayPause = useCallback(
    (index) => {
      const audioRef = refs[index];
      if (audioRef.paused) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
      dispatch({ type: "SET_PLAYING_INDEX", payload: index });
    },
    [state.playingIndex, refs]
  );

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
      dispatch({
        type: "SET_VOLUME_STATES",
        payload: {
          ...state.volumes,
          [index]: newVolume,
        },
      });
      if (refs[index]) {
        refs[index].volume = newVolume;
      }
    },
    [refs, state.volumes]
  );

  const handleProgressChange = useCallback(
    (e, index) => {
      const newTime = (e.target.value / 100) * (refs[index]?.duration || 0);
      if (isFinite(newTime)) {
        if (refs[index]) {
          refs[index].currentTime = newTime;
          dispatch({
            type: "SET_PROGRESS_STATES",
            payload: {
              ...state.progresses,
              [index]: e.target.value,
            },
          });
        }
      }
    },
    [dispatch, refs, state.progresses]
  );

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
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: {
        visible: true,
        x: e.clientX - rect.left + progressBar.offsetLeft,
        y: e.clientY - rect.top - 40,
        time: formatDuration(currentTime),
      },
    }));
  });

  const handleProgressMouseLeave = (index) => {
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: { ...prevTooltips[index], visible: false },
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
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: {
        visible: true,
        x: touch.clientX - rect.left + progressBar.offsetLeft,
        y: touch.clientY - rect.top - 40,
        time: formatDuration(currentTime),
      },
    }));
  };

  const handleProgressTouchEnd = (index) => {
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: { ...prevTooltips[index], visible: false },
    }));
  };

  const defineDurations = () => {
    refs.forEach((audio, index) => {
      if (audio) {
        const handleMetadataLoad = () => {
          setDurations((prevDurations) => ({
            ...prevDurations,
            [index]: audio.duration,
          }));
        };
        audio.addEventListener("loadedmetadata", handleMetadataLoad);
        return () => {
          audio.removeEventListener("loadedmetadata", handleMetadataLoad);
        };
      }
    });
  };

  useEffect(() => {
    defineDurations();
    return () => {
      refs.forEach((audio) => {
        if (audio) {
          audio.removeEventListener("loadedmetadata", () => {});
        }
      });
    };
  }, [audioRefs.current, mp3List.length]);

  useEffect(() => {
    const updateProgress = (index) => {
      if (refs[index] && isFinite(refs[index].duration)) {
        const progressPercentage = (refs[index].currentTime / refs[index].duration) * 100;
        dispatch({
          type: "SET_PROGRESS_STATES",
          payload: {
            ...state.progresses,
            [index]: isFinite(progressPercentage) ? progressPercentage : 0,
          },
        });
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
        const newMp3List = prevMp3List.filter((item) => item.youtubeID !== key.youtubeID);
        return newMp3List;
      });
    }
  };

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
        <div className="flex min-h-screen">
          <section className="flex-grow">
            <LoadingAnimation />
          </section>
        </div>
      ) : Object.keys(mp3List).length === 0 ? (
        <p className="text-lg text-center text-gray-300 h-screen">Convert any music to be able to listen to it here.</p>
      ) : Object.keys(filteredMP3s).length == 0 ? (
        <p className="text-lg text-center text-gray-300 h-screen">
          No music matches your search. Try being more case-sensitive.
        </p>
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
                      {/* Floating Player Toggle Button */}
                      <div className="flex items-center w-full">
                        {/* Play Button */}
                        <Button
                          aria_label="Play&Pause"
                          children={
                            isCurrentTrackPlaying ? (
                              <FiPlay className="stroke-gray-400" size={20} />
                            ) : (
                              <FiPause className="stroke-green-400" size={20} />
                            )
                          }
                          onClick={() => handlePlayPause(index)}
                          className="p-2 rounded-full bg-transparent hover:bg-[#777]"
                        />
                        {/* Song Title with Share Button */}
                        <ResultLink
                          className="text-sm sm:text-xl"
                          target="_blank"
                          url={currentTrack.youtubeURL}
                          href={currentTrack.url}
                          title={currentTrack.title}
                        />
                      </div>

                      {/* Container for the action buttons, aligned to the right */}
                      <div className="flex justify-between w-full space-x-4">
                        <div className="flex space-x-1 sm:space-x-4">
                          <Button
                            aria_label="Refresh item"
                            type="button"
                            children="Refresh Link"
                            onClick={() => handleRefreshLink(currentTrack)}
                            className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base  bg-[#555] text-[#4ecb52] hover:bg-[#777] duration-300"
                          />
                          <Button
                            aria_label="Delete item"
                            type="button"
                            children="Delete item"
                            onClick={() => handleDeleteItem(currentTrack, toast)}
                            className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base bg-[#555] text-[#FF5252] hover:bg-[#777]"
                          />
                          {/* Floating Player Toggle Button */}
                          <Button
                            aria_label="Toggle Floating Player"
                            onClick={() => handleFloatingPlayer(index)}
                            className="py-1 px-1 text-sm sm:py-2 sm:px-4 sm:text-base bg-green-500 text-white rounded hover:bg-green-700"
                            children="Toggle Floating Player"
                          />
                        </div>
                      </div>

                      {/* Total Duration */}
                      <p className="text-sm text-gray-400 whitespace-nowrap">Duration: {duration}</p>
                    </div>

                    {/* Volume and Progress Bars Column */}
                    <div className="flex flex-col items-center space-y-4 w-full">
                      <div className="relative w-full h-2 bg-gray-600 rounded-full max-w-[1000px]">
                        {/* Progress bar */}
                        <div className="h-2 bg-gray-600 rounded-full">
                          {/* Progress bar fill */}
                          <div
                            className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                            style={{
                              width: `${state.progresses[index] || 0}%`,
                            }}></div>

                          {/* Movable round div at the end of the progress */}
                          <div
                            className="absolute top-[-6px] transform -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-md"
                            style={{
                              left: `${state.progresses[index] || 0}%`,
                            }}></div>
                          {/* Hidden progress bar input */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={state.progresses[index] || 0}
                            onChange={(e) => handleProgressChange(e, index)}
                            className="absolute top-0 left-0 w-full h-2 appearance-none cursor-pointer bg-transparent z-10"
                            style={{
                              opacity: 0,
                            }}
                            onMouseMove={(e) => handleProgressMouseMove(e, index)}
                            onMouseLeave={() => handleProgressMouseLeave(index)}
                            onTouchMove={(e) => handleProgressTouchMove(e, index)}
                            onTouchEnd={() => handleProgressTouchEnd(index)}
                          />
                        </div>

                        {/* Tooltip */}
                        {tooltips[index]?.visible && (
                          <div
                            style={{
                              left: `${tooltips[index].x}px`,
                              top: `${tooltips[index].y}px`,
                            }}
                            className="absolute transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded">
                            {tooltips[index].time}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Loop Button and Volume Control */}
                    <div className="flex items-center space-x-4 w-full">
                      <Button
                        aria_label="Repeat"
                        children={
                          <FiRepeat
                            className={`${isCurrentTrackLooping ? "stroke-green-400" : "stroke-gray-400"}`}
                            size={20}
                          />
                        }
                        onClick={() => toggleLoop(index)}
                        className="p-3 rounded-full bg-transparent hover:bg-[#777]"
                      />
                      {/* Volume Control */}
                      <div className="flex items-center m-0 w-full space-x-3 max-w-[400px]">
                        <FiVolume2 className="stroke-green-400" size={35} />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={state.volumes[index] || 0.5}
                          onChange={(e) => handleVolumeChange(e, index)}
                          className="h-2 w-full rounded-lg cursor-pointer accent-green-500"
                        />
                        <p className="text-gray-400 text-sm text-right whitespace-nowrap">
                          File size: {formatFileSize(mp3List[key].fileSize)}
                        </p>
                      </div>
                    </div>
                    {/* Audio Element */}
                    <audio
                      inputMode="text"
                      ref={(el) => (audioRefs.current[index] = el)}
                      src={currentTrack.url}
                      preload="none"
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
            currentVolume={state.volumes[state.playingIndex] || 1}
          />
        )}
      </div>
    </div>
  );
};

export default MP3Player;
