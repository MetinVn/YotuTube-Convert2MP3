import React, { useEffect, useRef } from "react";

const AudioPlayer = ({ track, index, handlePlayPause, onLoadedMetadata, onPlay, onPause, isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = async () => {
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          onPlay();
        }
      } catch (error) {
        console.log("Playback prevented or failed:", error);
        onPause();
      }
    };

    if (isPlaying) {
      playAudio();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [isPlaying, onPlay, onPause]);

  return <audio ref={audioRef} src={track.url} preload="none" onLoadedMetadata={() => onLoadedMetadata(index)} />;
};

export default AudioPlayer;
