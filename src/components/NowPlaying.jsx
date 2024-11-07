import React, { useRef, useState, useEffect } from "react";
import { FiPlay, FiPause, FiVolume2, FiRepeat } from "react-icons/fi";
import ProgressBar from "./ProgressBar";

const NowPlaying = ({ mp3, onClose, toast, nextTrack }) => {
  const audioRef = useRef(null);
  const [isPlayable, setIsPlayable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const durationRef = useRef(0);

  const MAX_RETRIES = 1;
  const [retries, setRetries] = useState(0);
  const failedUrls = useRef(new Set());

  const handleError = () => {
    failedUrls.current.add(mp3.url);
    setErrorMessage("Audio file cannot be played. Attempting next track...");
    setIsPlayable(false);
    setIsLoading(false);
    setIsPlaying(false);
    setRetries(0);
    nextTrack();
  };

  const loadTrack = (track) => {
    if (failedUrls.current.has(track.url)) {
      setErrorMessage("This track is unavailable. Skipping...");
      nextTrack();
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setIsPlaying(false);
    setIsPlayable(false);
    audioRef.current.src = track.url;
    audioRef.current.load();
  };

  const handleLoadedData = () => {
    durationRef.current = audioRef.current.duration;
    if (durationRef.current > 0) {
      setIsPlayable(true);
      setIsLoading(false);
    } else {
      handleError();
    }
  };

  const handleCanPlay = () => {
    setIsPlayable(true);
    setIsLoading(false);
    playAudio();
  };

  const playAudio = () => {
    if (isPlayable && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          if (retries < MAX_RETRIES) {
            setRetries(retries + 1);
            loadTrack(mp3);
          } else {
            handleError();
          }
        });
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      playAudio();
    }
  };

  const handleProgressChange = (newProgress) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * durationRef.current;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && durationRef.current > 0) {
      const currentTime = audioRef.current.currentTime;
      const currentProgress = currentTime / durationRef.current;
      setProgress(Math.min(Math.max(currentProgress, 0), 1));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (isLooping) {
      playAudio();
    } else {
      nextTrack();
    }
  };

  useEffect(() => {
    if (mp3) loadTrack(mp3);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [mp3]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#333] text-white flex items-center space-x-4 shadow-lg rounded-lg mx-10 z-50">
      {/* Player Controls */}
      <button
        className="p-2 bg-[#4ADA31] text-white rounded-md cursor-pointer hover:bg-[#38a623]"
        onClick={handlePlayPause}
        disabled={isLoading || errorMessage}>
        {isPlaying ? <FiPause className="text-xl" /> : <FiPlay className="text-xl" />}
      </button>
      <div className="flex flex-col flex-grow-[10]">
        <h3 className="text-lg">{mp3.title}</h3>
        {isLoading && !errorMessage && <p className="text-yellow-300 animate-pulse">Loading...</p>}
        {!isLoading && errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <ProgressBar
          progress={isNaN(progress) ? 0 : progress}
          onChange={handleProgressChange}
          duration={durationRef.current || 0}
        />
      </div>
      {/* Volume and Loop Controls */}
      <div className="flex flex-col gap-2 flex-grow-[1] items-center justify-center">
        <div className="flex gap-2 items-center">
          <FiVolume2 className="stroke-[#4ADA31]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 rounded-full appearance-none bg-[#4ADA31] cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4ADA31 ${volume * 100}%, #ccc ${volume * 100}%)`,
            }}
          />
        </div>

        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`text-lg border px-2 py-1 rounded-lg hover:border-[#4ADA31] flex items-center gap-2 ${
            isLooping ? "text-[#4ADA31]" : "text-gray-400"
          }`}>
          Repeat <FiRepeat />
        </button>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-[#4ADA31]">
        Close
      </button>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onError={handleError}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="none">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default NowPlaying;
