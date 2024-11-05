import React from "react";
import { formatTime } from "../utils/FormatTime";

const ProgressBar = ({ progress, onChange, duration }) => {
  const totalSeconds = Math.floor(progress * duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  const formattedProgress = `${minutes}:${seconds}`;

  return (
    <div className="relative flex items-center w-full h-8">
      <div className="absolute inset-0 flex justify-between items-center h-full text-sm text-white">
        <span className="relative z-10 pointer-events-none">{formattedProgress}</span>
        <span className="relative z-10 pointer-events-none">{formatTime(duration)}</span>
      </div>
      {/* Progress bar background (unplayed portion) */}
      <div className="absolute inset-0 h-full bg-gray-600 rounded-lg"></div>
      {/* Played portion of the progress bar */}
      <div
        className="absolute h-full bg-[#4ADA31] rounded-lg"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}></div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={Math.min(Math.max(progress, 0), 1)}
        onChange={(e) => onChange(Number(e.target.value) * 100)}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default ProgressBar;
