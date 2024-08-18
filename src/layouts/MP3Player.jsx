import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiRepeat,
  FiDownload,
} from "react-icons/fi";

const MP3Player = ({ mp3List, toast, toastContainer }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [loopingStates, setLoopingStates] = useState({});
  const [volumes, setVolumes] = useState({});
  const [progresses, setProgresses] = useState({});
  const [durations, setDurations] = useState({});
  const [tooltips, setTooltips] = useState({});
  const audioRefs = useRef([]);

  const handlePlayPause = useCallback(
    (index) => {
      if (playingIndex === index) {
        setPlayingIndex(null);
      } else {
        setPlayingIndex(index);
      }
    },
    [playingIndex]
  );

  const handleVolumeChange = useCallback((e, index) => {
    const newVolume = e.target.value;
    setVolumes((prevVolumes) => ({
      ...prevVolumes,
      [index]: newVolume,
    }));
    if (audioRefs.current[index]) {
      audioRefs.current[index].volume = newVolume;
    }
  }, []);

  const handleProgressChange = useCallback((e, index) => {
    const newTime =
      (e.target.value / 100) * (audioRefs.current[index]?.duration || 0);
    if (isFinite(newTime)) {
      if (audioRefs.current[index]) {
        audioRefs.current[index].currentTime = newTime;
        setProgresses((prevProgresses) => ({
          ...prevProgresses,
          [index]: e.target.value,
        }));
      }
    }
  }, []);

  const toggleLoop = useCallback(
    (index) => {
      setLoopingStates((prevLoopingStates) => ({
        ...prevLoopingStates,
        [index]: !prevLoopingStates[index],
      }));
      toast(loopingStates[index] ? "Looping disabled" : "Looping enabled");
    },
    [loopingStates, toast]
  );

  const formatDuration = (duration) => {
    if (!isFinite(duration)) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleProgressMouseMove = (e, index) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    const duration = audioRefs.current[index]?.duration || 0;
    const currentTime = (percentage / 100) * duration;
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: {
        visible: true,
        x: e.clientX - rect.left + progressBar.offsetLeft,
        y: e.clientY - rect.top + progressBar.offsetTop - 40,
        time: formatDuration(currentTime),
      },
    }));
  };

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
    const duration = audioRefs.current[index]?.duration || 0;
    const currentTime = (percentage / 100) * duration;
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [index]: {
        visible: true,
        x: touch.clientX - rect.left + progressBar.offsetLeft,
        y: touch.clientY - rect.top + progressBar.offsetTop - 40,
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

  useEffect(() => {
    const updateProgress = (index) => {
      if (
        audioRefs.current[index] &&
        isFinite(audioRefs.current[index].duration)
      ) {
        const progressPercentage =
          (audioRefs.current[index].currentTime /
            audioRefs.current[index].duration) *
          100;
        setProgresses((prevProgresses) => ({
          ...prevProgresses,
          [index]: isFinite(progressPercentage) ? progressPercentage : 0,
        }));
        setDurations((prevDurations) => ({
          ...prevDurations,
          [index]: audioRefs.current[index].duration,
        }));
      }
    };

    const refs = audioRefs.current;
    refs.forEach((audio, index) => {
      if (audio) {
        const handleTimeUpdate = () => updateProgress(index);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    });
  }, [playingIndex]);

  useEffect(() => {
    if (playingIndex !== null && audioRefs.current[playingIndex]) {
      audioRefs.current[playingIndex].play().catch((error) => {
        console.error("Playback failed:", error);
        toast.error("Playback failed. Please check the file.");
      });
    }
    audioRefs.current.forEach((audio, index) => {
      if (audio && index !== playingIndex) {
        audio.pause();
      }
    });
  }, [playingIndex, toast]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
        Music Player
      </h1>
      {toastContainer}
      {Object.keys(mp3List).length === 0 ? (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Convert any music to be able to listen to it here.
        </p>
      ) : (
        <ul className="space-y-4 text-sm">
          {Object.keys(mp3List).map((key, index) => {
            const currentTrack = mp3List[key];
            const isCurrentTrackPlaying = playingIndex === index;
            const isCurrentTrackLooping = loopingStates[index] || false;
            const duration = formatDuration(durations[index] || 0);

            return (
              <li
                key={key}
                className="p-4 border border-gray-200 rounded-xl bg-white dark:bg-[#1f1f1f] dark:border-[#444] shadow-md transition-colors duration-300">
                <div className="flex flex-col items-center space-y-3 w-full">
                  {/* Song Title */}
                  <p className="font-bold text-base text-green-500 text-center w-full">
                    {currentTrack.title}
                  </p>

                  {/* Total Duration */}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {duration}
                  </p>

                  {/* Play/Pause and Loop Buttons */}
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handlePlayPause(index)}
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
                      {isCurrentTrackPlaying ? (
                        <FiPause color="green" size={20} />
                      ) : (
                        <FiPlay color="green" size={20} />
                      )}
                    </button>

                    <button
                      onClick={() => toggleLoop(index)}
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
                      <FiRepeat
                        size={20}
                        className={
                          isCurrentTrackLooping
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      />
                    </button>
                  </div>

                  {/* Volume and Progress Bars in Column Layout */}
                  <div className="flex flex-col items-center space-y-3 w-full">
                    {/* Volume Control */}
                    <div className="flex items-center space-x-3 w-full">
                      <FiVolume2 color="green" size={20} />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volumes[index] || 1}
                        onChange={(e) => handleVolumeChange(e, index)}
                        className="w-full h-2 rounded-lg cursor-pointer accent-green-500"
                      />
                    </div>

                    {/* Progress Bar */}
                    <div
                      className="relative w-[90%]"
                      onMouseLeave={() => handleProgressMouseLeave(index)}
                      onTouchEnd={() => handleProgressTouchEnd(index)}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={progresses[index] || 0}
                        onChange={(e) => handleProgressChange(e, index)}
                        onMouseMove={(e) => handleProgressMouseMove(e, index)}
                        onTouchMove={(e) => handleProgressTouchMove(e, index)}
                        className="w-full h-2 rounded-lg cursor-pointer accent-green-500"
                      />
                      {tooltips[index]?.visible && (
                        <div
                          className="absolute bg-black text-white text-xs rounded-md px-2 py-1"
                          style={{
                            left: `${tooltips[index].x}px`,
                            top: `${tooltips[index].y}px`,
                            transform: "translateX(-50%)",
                          }}>
                          {tooltips[index].time}
                        </div>
                      )}
                    </div>
                    <a
                      href={currentTrack.url}
                      download={currentTrack.title + ".mp3"}
                      className="flex items-center space-x-2 py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition duration-300">
                      <FiDownload size={16} />
                      <span>Download</span>
                    </a>
                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={currentTrack.url}
                    loop={isCurrentTrackLooping}
                    onEnded={() => {
                      setPlayingIndex(null);
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MP3Player;
