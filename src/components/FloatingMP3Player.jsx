import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaTimes } from "react-icons/fa";

const FloatingMP3Displayer = ({
  title,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onClosePlayer,
  onVolumeChange,
  currentVolume,
}) => {
  return (
    <div
      className="
    fixed z-50 top-1/2 right-2 border border-[#4CAF50] transform -translate-y-1/2 bg-[#333] text-white p-2 rounded-lg shadow-lg 
    w-40 flex flex-col items-center 
    sm:w-48 sm:p-3
    md:w-60 md:p-4
  ">
      {/* Close Button */}
      <button
        className="absolute top-1 right-1 text-[#1E1E1E] hover:text-[#4CAF50] sm:top-2 sm:right-2 duration-300"
        onClick={onClosePlayer}
        aria-label="Close Player">
        <FaTimes />
      </button>

      {/* Track Title */}
      <p className="mb-1 text-center text-xs sm:text-sm md:text-base">{title}</p>

      {/* Controls */}
      <div className="flex items-center justify-around w-full">
        <button
          onClick={onPrevious}
          className="
            text-lg text-[#4CAF50] hover:text-[#388E3C] transition-colors duration-300 
            sm:text-xl md:text-2xl
          "
          aria-label="Previous Track">
          <FaStepBackward />
        </button>

        <button
          onClick={isPlaying ? onPlay : onPause}
          className="
            text-lg text-[#4CAF50] hover:text-[#388E3C] transition-colors duration-300 
            sm:text-xl md:text-2xl
          "
          aria-label={isPlaying ? "Play" : "Pause"}>
          {isPlaying ? <FaPlay /> : <FaPause />}
        </button>

        <button
          onClick={onNext}
          className="
            text-lg text-[#4CAF50] hover:text-[#388E3C] transition-colors duration-300 
            sm:text-xl md:text-2xl
          "
          aria-label="Next Track">
          <FaStepForward />
        </button>
      </div>

      {/* Volume Control */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={currentVolume || 1}
        onChange={onVolumeChange}
        className="
          mt-2 w-full accent-[#4CAF50] 
          sm:mt-3
        "
        aria-label="Volume Control"
      />
    </div>
  );
};

export default FloatingMP3Displayer;
